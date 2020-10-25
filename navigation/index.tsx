import { NavigationContainer, DefaultTheme, DarkTheme, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'
import LoginScreen from '../screens/Auth/LoginScreen'
import SignupScreen from '../screens/Auth/SignupScreen'

import NotFoundScreen from '../screens/NotFoundScreen'
import { RootStackParamList } from '../types'
import BottomTabNavigator from './BottomTabNavigator'
import LinkingConfiguration from './LinkingConfiguration'
import EventScreen from '../screens/Home/EventScreen'
import { navigationRef } from '../utils/navigation.utils'
import RoomScreen from '../screens/Home/RoomScreen'

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme, onReady }: { colorScheme: ColorSchemeName; onReady: () => void }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      onReady={onReady}
      ref={navigationRef}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Room" component={RoomScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  )
}

const AuthStack = createStackNavigator()

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  )
}
