import React from 'react'
import { Container, Content, Text, List, ListItem, Icon } from 'native-base'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { ImageBackground } from 'react-native'
import { DrawerNavigationState } from '@react-navigation/native'
import background from '../assets/images/drawer.png'
import { useUser } from '../hooks/useUser'

const SideBar: React.FC<DrawerContentComponentProps> = (props) => {
  const { state } = props
  const { user } = useUser()

  return (
    <Container>
      <Content>
        <ImageBackground
          source={background}
          style={{
            height: 120,
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Icon name="ios-happy" />
          <Text>
            {user?.firstName} {user?.lastName}
          </Text>
        </ImageBackground>
        <List
          dataArray={state.routes}
          keyExtractor={(route) => route.key}
          renderRow={(data) => <SideBarItem {...props} data={data} />}
        />
      </Content>
    </Container>
  )
}

type SideBarItemProps = DrawerContentComponentProps & {
  data: DrawerNavigationState['routes'][0]
}

const SideBarItem: React.FC<SideBarItemProps> = ({ navigation, descriptors, data, state }) => {
  const isFocused = state.routes[state.index].key === data.key
  const { options } = descriptors[data.key]
  const label =
    // eslint-disable-next-line no-nested-ternary
    options.drawerLabel !== undefined ? options.drawerLabel : options.title !== undefined ? options.title : data.name

  const onPress = () => {
    navigation.navigate(data.name)
  }

  if (options.hidden) {
    return null
  }

  return (
    <ListItem button onPress={onPress}>
      <Text>{label}</Text>
    </ListItem>
  )
}

export default SideBar
