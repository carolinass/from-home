import React, { useCallback, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import * as AuthSession from 'expo-auth-session'
import * as Linking from 'expo-linking'
import { Button, H3, List, ListItem, Text } from 'native-base'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'

const ConnectGoogleScreen: React.FC<StackScreenProps<any>> = () => {
  const { user } = useUser()

  const connectGoogle = useCallback(async () => {
    const googleWebAppId = '692132375812-m44gevu8kha2v3duju0nf75sm09o6385.apps.googleusercontent.com'
    const redirectUrl = 'https://us-central1-nonow-e7237.cloudfunctions.net/linkGoogle'

    await AuthSession.startAsync({
      authUrl:
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `&client_id=${googleWebAppId}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&response_type=code` +
        `&access_type=offline` +
        // TODO: make this more secure, sending the userid is not enough for connecting to google
        `&state=${encodeURIComponent(JSON.stringify({ appUrl: Linking.makeUrl('/?'), userId: user?.uid }))}` +
        `&scope=${encodeURIComponent('profile email https://www.googleapis.com/auth/calendar.readonly')}`
    })
  }, [user])

  return (
    <BaseLayout title="Connect Google" showBackButton>
      <Text>
        By connecting with google calendar, we will be able to import all your events as they come up automatically. You
        can connect multiple google accounts.
      </Text>
      <H3 style={{ marginTop: 20 }}>Connected Google Calendar Accounts</H3>
      <List>
        {(user?.connectedGoogleAccounts ?? []).map((account) => (
          <ListItem key={account}>
            <Text>{account}</Text>
          </ListItem>
        ))}
      </List>

      <Button onPress={connectGoogle} style={{ marginTop: 10 }}>
        <Text>Connect with Google Calendar</Text>
      </Button>
    </BaseLayout>
  )
}

export default ConnectGoogleScreen
