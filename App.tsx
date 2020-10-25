import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as firebase from 'firebase'
import { Root, Spinner } from 'native-base'
import { LogBox, Platform } from 'react-native'
import UserProvider from './contexts/userContext'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'
import { useNotificationHandler } from './utils/notification.utils'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

LogBox.ignoreLogs(['Setting a timer'])

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const [userReady, setUserReady] = useState(false)

  const [navigationReady, setNavigationReady] = useState(false)
  const { expoPushToken } = useNotificationHandler(navigationReady)

  return (
    <SafeAreaProvider>
      <UserProvider onDoneLoading={() => setUserReady(true)} expoPushToken={expoPushToken}>
        <Root>
          {!isLoadingComplete || !userReady ? (
            <Spinner />
          ) : (
            <Navigation colorScheme={colorScheme} onReady={() => setNavigationReady(true)} />
          )}
        </Root>
        <StatusBar />
      </UserProvider>
    </SafeAreaProvider>
  )
}
