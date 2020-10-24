import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import * as React from 'react'

import { Icon } from 'native-base'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CreateHome from '../screens/Home/CreateHome'
import Home from '../screens/Home/Home'
import TabTwoScreen from '../screens/TabTwoScreen'
import { BottomTabParamList, TabTwoParamList } from '../types'
import TabMoreScreen from '../screens/TabMoreScreen'
import TabBar from './TabBar'
import CreateRoom from '../screens/Home/CreateRoom'
import ScheduleEventScreen from '../screens/Home/ScheduleEventScreen'
import SideBar from './Sidebar'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Overview"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
      tabBar={TabBar}
    >
      <BottomTab.Screen
        name="Overview"
        component={HomeNavigator}
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
const HomeStack = createDrawerNavigator()

function HomeNavigator() {
  return (
    <HomeStack.Navigator drawerContent={(props) => <SideBar {...props} />}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Create Home" component={CreateHome} />
      <HomeStack.Screen name="Create Room" component={CreateRoom} />
      <HomeStack.Screen name="Schedule Event" component={ScheduleEventScreen} />
    </HomeStack.Navigator>
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
