import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { firestore } from 'firebase'
import { Body, Button, H1, Icon, Left, ListItem, Right, Switch, Text, Thumbnail, View } from 'native-base'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native'
import { StyleSheet } from 'react-native';
import { isBefore, isAfter } from 'date-fns'
// @ts-ignore
import background from '../../assets/images/drawer.png'
import ImagePicker from '../../components/ImagePicker'

const ProfileScreen: React.FC<DrawerScreenProps<any>> = ({ route }) => {
  const { user } = useUser()
  const [home, setHome] = useState()
  const [events, setEvents] = useState<any[]>([])

  const getUserEvents = () => {
    const db = firestore()
    db.collection('events')
      .where('people', 'array-contains', user?.uid)
      .onSnapshot((querySnapshot) => {
        const events: React.SetStateAction<any[]> = []
        querySnapshot.forEach((doc) => {
          events.push({ id: doc.id, ...doc.data() })
        })
        setEvents(events)
      })
  }

  const isAvailable = () => {
    if (!user) return false
    for (const event of events) {
      if (event.people.includes(user.uid)) {
        if (isBefore(event.startDate.toDate(), Date.now()) && isAfter(event.endDate.toDate(), Date.now())) {
          return false
        }
      }
    }
    return true
  }

  useEffect(() => {
    if (!user || !user?.homeId) return
    const db = firestore()
    db.collection('homes')
      .doc(user?.homeId)
      .get()
      .then((doc) => {
        // @ts-ignore
        setHome({ id: doc.id, ...doc.data()})
        getUserEvents()
      })
  }, [user])

  const onPickImage = (image: string) => {
    if (!user) return
    const db = firestore()
    db.collection('users').doc(user.uid).set({
      image
    }, { merge: true })
  }

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
            <ImagePicker onPickImage={onPickImage}>
              <Thumbnail
                style={styles.thumbnail}
                source={{ uri: user?.image || 'https://firebasestorage.googleapis.com/v0/b/nonow-e7237.appspot.com/o/Screen%20Shot%202020-10-25%20at%202.46.20%20PM.png?alt=media&token=0bce169f-69cd-48f9-9119-ecf29ed15e50' }}
              />
            </ImagePicker>
            <H1 style={styles.title}>{`${user?.firstName} ${user?.lastName}`}</H1>
        </View>
      </ImageBackground>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "transparent" }}>
            {
              isAvailable()
                ? <Ionicons size={24} name="ios-radio-button-on" color="green" />
                : <Ionicons size={24} name="ios-radio-button-on" color="red" />
            }
          </Button>
        </Left>
        <Body>
          {
            isAvailable() ? <Text>Available</Text> : <Text>Busy</Text>
          }
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
