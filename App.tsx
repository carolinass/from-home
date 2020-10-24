import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import UserProvider from './contexts/userContext'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { Root } from 'native-base';

firebase.initializeApp(firebaseConfig);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    }).then(() => setIsReady(true))
  }, [])

  if (!isReady || !isLoadingComplete) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <Root>
          <Navigation colorScheme={colorScheme} />
        </Root>
        <StatusBar />
      </UserProvider>
    </SafeAreaProvider>
  );
}
