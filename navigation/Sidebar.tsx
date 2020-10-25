import React from 'react'
import { Container, Content, Text, List, ListItem, H3, View, Thumbnail, Icon } from 'native-base'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Image, ImageBackground } from 'react-native';
import { DrawerNavigationState } from '@react-navigation/native'
import background from '../assets/images/drawer.png'
import { useUser } from '../hooks/useUser'
import { StyleSheet } from 'react-native'

const SideBar: React.FC<DrawerContentComponentProps> = (props) => {
  const { state } = props
  const { user } = useUser()

  return (
    <Container>
      <Content>
        <ImageBackground
          source={background}
          style={styles.imageBackground}
        >
          <View style={styles.overlay}>
            <Thumbnail style={styles.thumbnail} source={{ uri: user?.image || 'https://firebasestorage.googleapis.com/v0/b/nonow-e7237.appspot.com/o/Screen%20Shot%202020-10-25%20at%202.46.20%20PM.png?alt=media&token=0bce169f-69cd-48f9-9119-ecf29ed15e50' }} />
            <H3>
              {user?.firstName} {user?.lastName}
            </H3>
          </View>
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

const styles = StyleSheet.create({
  title: { textAlign: 'center', paddingBottom: 0, paddingTop: 0 },
  thumbnail: { marginRight: 20 },
  imageBackground: {
    height: 100,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  overlay: {
    paddingTop: 0,
    paddingLeft: 20,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'rgba(255,255,255,0.5)'
  }
});

export default SideBar
