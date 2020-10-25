import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import axios from 'axios'
import * as querystring from 'querystring'
import { google } from 'googleapis'

admin.initializeApp()

const { clientid, clientsecret } = functions.config().google
export const getOauth2Client = () =>
  new google.auth.OAuth2(clientid, clientsecret, 'https://us-central1-nonow-e7237.cloudfunctions.net/linkGoogle')

export const linkGoogle = functions.https.onRequest(async (request, response) => {
  const { code, state } = request.query
  const { appUrl, userId } = JSON.parse(state as string)

  try {
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      querystring.stringify({
        code: code as any,
        client_id: clientid,
        client_secret: clientsecret,
        redirect_uri: 'https://us-central1-nonow-e7237.cloudfunctions.net/linkGoogle',
        grant_type: 'authorization_code'
      })
    )

    const { refresh_token, access_token } = data

    const oauth2Client = getOauth2Client()
    oauth2Client.setCredentials({ access_token, refresh_token })
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    })
    const { data: userInfo } = await oauth2.userinfo.get()

    await admin
      .firestore()
      .doc(`/private-user-data/${userId}`)
      .set(
        {
          googleRefreshTokens: admin.firestore.FieldValue.arrayUnion(refresh_token),
          googleEmails: admin.firestore.FieldValue.arrayUnion(userInfo.email)
        },
        { merge: true }
      )

    await admin
      .firestore()
      .doc(`/users/${userId}`)
      .update({ connectedGoogleAccounts: admin.firestore.FieldValue.arrayUnion(userInfo.email) })

    response.redirect(appUrl)
  } catch (err) {
    if (err.isAxiosError) {
      functions.logger.error({ statusCode: err.response.status, data: err.response.data }, { structuredData: true })
    } else {
      functions.logger.error(err, { structuredData: true })
    }
    response.send('An error happend.')
  }
})
