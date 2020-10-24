import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import { Icon } from 'native-base'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CreateHome from '../screens/CreateHome'
import Home from '../screens/Home'
import TabTwoScreen from '../screens/TabTwoScreen'
import { BottomTabParamList, HomeParamList, TabTwoParamList } from '../types'
import TabMoreScreen from '../screens/TabMoreScreen'
import TabBar from './TabBar'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="TabOneNavigator"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
      tabBar={TabBar}
    >
      <BottomTab.Screen
        name="TabOneNavigator"
        component={TabOneNavigator}
        options={{
          tabBarIcon: () => <Icon name="ios-code" />
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: () => <Icon name="ios-code" />
        }}
      />
      <BottomTab.Screen
        name="More"
        component={TabMoreNavigator}
        options={{
          tabBarIcon: () => <Icon name="ios-menu" />
        }}
      />
    </BottomTab.Navigator>
  )
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<HomeParamList>()

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen name="Home" component={Home} options={{ headerTitle: 'Home' }} />
      <TabOneStack.Screen name="CreateHome" component={CreateHome} options={{ headerTitle: 'Create Home' }} />
    </TabOneStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen name="TabTwoScreen" component={TabTwoScreen} options={{ headerTitle: 'Tab Two Title' }} />
    </TabTwoStack.Navigator>
  )
}

const TabMoreStack = createStackNavigator()

function TabMoreNavigator() {
  return (
    <TabMoreStack.Navigator screenOptions={{ headerShown: false }}>
      <TabMoreStack.Screen name="TabMoreScreen" component={TabMoreScreen} options={{ headerTitle: 'Tab More Title' }} />
    </TabMoreStack.Navigator>
  )
}
