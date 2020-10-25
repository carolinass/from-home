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
import UpcomingEventsScreen from '../screens/Home/UpcomingEventsScreen'
import SideBar from './Sidebar'
import InviteFriend from '../screens/Home/InviteFriend'
import JoinHome from '../screens/Home/JoinHome'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
      tabBar={TabBar}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: () => <Icon name="ios-home" />
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: () => <Icon name="ios-contact" />
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
      <HomeStack.Screen name="My Home" component={Home} options={{ unmountOnBlur: true }} />
      <HomeStack.Screen name="Create Room" component={CreateRoom} />
      <HomeStack.Screen name="Schedule Event" component={ScheduleEventScreen} options={{ unmountOnBlur: true }} />
      <HomeStack.Screen name="Upcoming Events" component={UpcomingEventsScreen} options={{ unmountOnBlur: true }} />
      <HomeStack.Screen name="Invite Friend" component={InviteFriend} />

      <HomeStack.Screen name="Create Home" component={CreateHome} options={{ hidden: true }} />
      <HomeStack.Screen name="Join Home" component={JoinHome} options={{ hidden: true }} />
    </HomeStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen name="Profile" component={TabTwoScreen} />
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
