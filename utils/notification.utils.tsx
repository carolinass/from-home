import { useEffect, useRef, useState } from 'react'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { navigate } from './navigation.utils'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

export const useNotificationHandler = (navigationReady: boolean) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('')
  const [notification, setNotification] = useState<any>(false)
  const notificationListener = useRef<any>(null)
  const responseListener = useRef<any>(null)

  useEffect(() => {
    if (navigationReady) {
      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif)
      })

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content as any
        if (data?.navigate) {
          navigate(data.navigate.route, data.navigate.params)
        }
      })

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
    return undefined
  }, [navigationReady])

  return { expoPushToken }
}

export const registerForPushNotificationsAsync = async () => {
  let token
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return undefined
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return token
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
export const sendPushNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: { navigate: { route: string; params: { [key: string]: string } } }
) => {
  const messages = tokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data
  }))

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messages)
  })
}
