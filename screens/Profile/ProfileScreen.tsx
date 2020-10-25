import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { firestore } from 'firebase'
import { Body, Button, H1, Icon, Left, ListItem, Right, Switch, Text, Thumbnail, View } from 'native-base'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native'
import { StyleSheet } from 'react-native';
import background from '../../assets/images/drawer.png'

const ProfileScreen: React.FC<DrawerScreenProps<any>> = ({ route }) => {
  const { user } = useUser()
  const [home, setHome] = useState()

  useEffect(() => {
    if (!user || !user?.homeId) return
    const db = firestore()
    db.collection('homes')
      .doc(user?.homeId)
      .get()
      .then((doc) => {
        // @ts-ignore
        setHome({ id: doc.id, ...doc.data()})
      })
  }, [user])

  return (
    <BaseLayout
      title="Profile"
      full={true}
      showBackButton
      rightContent={
        <Button transparent>
          <Icon type="EvilIcons" name="pencil" />
        </Button>
      }
    >
      <ImageBackground
          source={background}
          style={styles.imageBackground}
        >
          <View style={styles.overlay}>
            <Thumbnail
              style={styles.thumbnail}
              source={{ uri: user?.image || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif' }}
            />
            <H1 style={styles.title}>{`${user?.firstName} ${user?.lastName}`}</H1>
        </View>
      </ImageBackground>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "transparent" }}>
            <Ionicons size={24} name="ios-radio-button-on" color="green" />
          </Button>
        </Left>
        <Body>
          {/* @ts-ignore */}
          <Text>Available</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "#FF9501" }}>
            <Icon active name="home" />
          </Button>
        </Left>
        <Body>
          {/* @ts-ignore */}
          <Text>{home?.name}</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "#F92223" }}>
            <Icon active name="notifications" />
          </Button>
        </Left>
        <Body>
          <Text>Notifications</Text>
        </Body>
        <Right>
          <Switch value={false} />
        </Right>
      </ListItem>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  title: { textAlign: 'center', paddingBottom: 25, paddingTop: 0 },
  thumbnail: { margin: 35, marginBottom: 20, alignSelf: 'center', height: 120, width: 120, borderRadius: 60 },
  imageBackground: {
    height: 250,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  overlay: {
    width: '100%',
    flex: 1,
    justifyContent: "center",
    backgroundColor:'rgba(255,255,255,0.5)'
  }
});

export default ProfileScreen
