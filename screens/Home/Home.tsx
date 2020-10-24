import React, { useState, useEffect } from 'react';
import { Button, Text, H3, List, ListItem } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../../hooks/useUser';
import { BaseLayout } from '../../components/layout';
import { StyleSheet } from 'react-native';

interface Home {
  id: string
  name: string
  users: string[]
  rooms: string[]
}

// @ts-ignore
const Home = ({ navigation }) => {
  const { user } = useUser()
  const [home, setHome] = useState<Home>()
  const [roomates, setRoomates] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])

  const goToCreateHome = () => {
    navigation.navigate('Home', { screen: 'Create Home' });
  }

  const goToJoinHome = () => {
    navigation.navigate('Home', { screen: 'Join Home' });
  }

  const goToCreateRoom = () => {
    navigation.navigate('Home', { screen: 'Create Room' });
  }

  const goToInviteFriend = () => {
    navigation.navigate('Invite Friend', { screen: 'Create Home' });
  }

  const newEvent = () => {
    console.log('new event')
  }

  const getRoomates = async (homeId: string) => {
    const db = firebase.firestore();
    db.collection('users').where('homeId', '==', homeId)
      .onSnapshot((querySnapshot) => {
        // @ts-ignore
        const roomates = [];
        querySnapshot.forEach(function(doc) {
            roomates.push({ id: doc.id, ...doc.data() });
        });
        // @ts-ignore
        setRoomates(roomates.filter(rommate => rommate.id !== user.uid))
      }
    );

  }

  const getRooms = async (homeId: string) => {
    const db = firebase.firestore();
    db.collection('rooms')
      .where('homeId', '==', homeId)
      .onSnapshot((querySnapshot) => {
        const rooms: React.SetStateAction<any[]> = [];
        querySnapshot.forEach(function(doc) {
            rooms.push({ id: doc.id, ...doc.data() });
        });
        setRooms(rooms)
      }
    );
  }

  useEffect(() => {
    if (!user || !user.homeId) return
    const homeId = user.homeId
    const db = firebase.firestore();
    db.collection('homes').doc(homeId).get().then(doc => {
      // @ts-ignore
      setHome({ id: doc.id, ...doc.data() })
      getRoomates(doc.id)
      getRooms(doc.id)
    })
  }, [user])

  return (
    user && user.homeId && home ?
      <BaseLayout title={home.name}>
        <Button block onPress={newEvent} style={styles.extraMargin}>
          <Text>New Event</Text>
        </Button>
        <List style={styles.extraMargin}>
          <ListItem itemHeader first>
            <H3>ROOMIES</H3>
          </ListItem>
          {roomates.map((roomate, i) =>
            <ListItem key={i}>
              <Text>{`${roomate?.firstName} ${roomate?.lastName}`}</Text>
            </ListItem>
          )}
          <Button transparent onPress={goToInviteFriend}>
            <Text>Invite Roomate</Text>
          </Button>
        </List>
        <List>
          <ListItem itemHeader first>
            <H3>ROOMS</H3>
          </ListItem>
          {rooms.map((room, i) =>
            <ListItem key={i}>
              <Text>{room.name}</Text>
            </ListItem>
          )}
        </List>
        <Button transparent onPress={goToCreateRoom}>
          <Text>Add Room</Text>
        </Button>
      </BaseLayout>
    :
      <BaseLayout title="Home">
        <Button block onPress={goToCreateHome} style={styles.extraMargin}>
          <Text>Create New Home</Text>
        </Button>
        <Button block onPress={goToJoinHome}>
          <Text>Join Existing Home</Text>
        </Button>
      </BaseLayout>
  );
}

const styles = StyleSheet.create({
  extraMargin: {
    marginTop: 15,
    marginBottom: 15
  }
});

export default Home
