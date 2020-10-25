import { google } from 'googleapis'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { addDays } from 'date-fns'
import { getOauth2Client } from './link-google'

// TODO: refactor! Really bad code coming up
export const syncGoogleCalendar = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const users = await admin.firestore().collection('/private-user-data').get()
  await Promise.all(
    users.docs.map(async (userData) => {
      const userFetch = await admin.firestore().doc(`users/${userData.id}`).get()

      for (const token of userData.data().googleRefreshTokens) {
        const oauth2Client = getOauth2Client()
        oauth2Client.setCredentials({ refresh_token: token })

        try {
          const calendars = await google.calendar('v3').calendarList.list({ auth: oauth2Client })
          await Promise.all(
            calendars.data.items!.map(async (calendar) => {
              const events = await google.calendar('v3').events.list({
                calendarId: calendar.id as string,
                auth: oauth2Client,
                singleEvents: true,
                timeMin: new Date().toISOString(),
                timeMax: addDays(new Date(), 1).toISOString()
              })

              for (const event of events.data.items ?? []) {
                admin
                  .firestore()
                  .doc(`events/${event.id}`)
                  .set({
                    isGoogleEvent: true,
                    endDate: new Date(event.end?.dateTime ?? ''),
                    homeId: userFetch.data()!.homeId,
                    people: [userFetch.id],
                    room: null,
                    title: event.summary,
                    startDate: new Date(event.start?.dateTime ?? '')
                  })
              }
            })
          )
        } catch (err) {
          functions.logger.info(err, { structuredData: true })
        }
      }
    })
  )
})
