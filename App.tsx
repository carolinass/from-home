import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as firebase from 'firebase'
import { Root, Spinner } from 'native-base'
import { LogBox } from 'react-native'
import UserProvider from './contexts/userContext'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

LogBox.ignoreLogs(['Setting a timer'])

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const [userReady, setUserReady] = useState(false)

  return (
    <SafeAreaProvider>
      <UserProvider onDoneLoading={() => setUserReady(true)}>
        <Root>{!isLoadingComplete || !userReady ? <Spinner /> : <Navigation colorScheme={colorScheme} />}</Root>
        <StatusBar />
      </UserProvider>
    </SafeAreaProvider>
  )
}
