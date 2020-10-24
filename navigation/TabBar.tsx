import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Button, Footer, FooterTab, Text } from 'native-base'
import { TabNavigationState } from '@react-navigation/native'

const TabBar: React.FC<BottomTabBarProps> = (props) => {
  const { state } = props

  return (
    <Footer>
      <FooterTab>
        {state.routes.map((route, index) => (
          <TabBarItem key={route.key} {...props} index={index} route={route} />
        ))}
      </FooterTab>
    </Footer>
  )
}

type TabBarItemProps = BottomTabBarProps & {
  route: TabNavigationState['routes'][0]
  index: number
}
const TabBarItem: React.FC<TabBarItemProps> = ({ route, state, navigation, index, descriptors }) => {
  const isFocused = state.index === index
  const { options } = descriptors[route.key]
  const label =
    // eslint-disable-next-line no-nested-ternary
    options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true
    })

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name)
    }
  }

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key
    })
  }

  return (
    <Button
      vertical
      active={isFocused}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
    >
      {options.tabBarIcon?.({ focused: isFocused, color: '', size: 0 })}
      <Text>{label}</Text>
    </Button>
  )
}

export default TabBar
