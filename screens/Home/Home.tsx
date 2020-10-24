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
    navigation.navigate('Overview', { screen: 'Create Home' });
  }

  const goToCreateRoom = () => {
    navigation.navigate('Overview', { screen: 'Create Room' });
  }

  const newEvent = () => {
    console.log('new event')
  }

  const getRoomates = async (home: Home) => {
    const db = firebase.firestore();
    const roomates = await Promise.all(home.users.map(async roomateId => {
      const doc = await db.collection('users').doc(roomateId).get();
      return { id: doc.id, ...doc.data()}
    }))

    // @ts-ignore
    setRoomates(roomates.filter(rommate => rommate.id !== user.uid))
  }

  const getRooms = async (homeId: string) => {
    const db = firebase.firestore();
    db.collection('rooms').where('homeId', '==', homeId)
      .onSnapshot((querySnapshot) => {
        // @ts-ignore
        const rooms = [];
        querySnapshot.forEach(function(doc) {
            rooms.push({ id: doc.id, ...doc.data() });
        });
        // @ts-ignore
        setRooms(rooms)
      }
    );
  }

  useEffect(() => {
    // @ts-ignore
    if (!user || !user.homeId) return
    // @ts-ignore
    const homeId = user.homeId
    const db = firebase.firestore();
    db.collection('homes').doc(homeId).get().then(doc => {
      // @ts-ignore
      setHome({ id: doc.id, ...doc.data() })
      getRoomates({ id: doc.id, ...doc.data() } as Home)
      getRooms(doc.id)
    })
  }, [user])

  return (
    // @ts-ignore
    user && user.homeId && home ?
      <BaseLayout title={home.name}>
        <Button block onPress={newEvent} style={styles.newEventBtn}>
          <Text>New Event</Text>
        </Button>
        <List style={styles.list}>
          <ListItem itemHeader first>
            <H3>ROOMIES</H3>
          </ListItem>
          {roomates.map((roomate, i) =>
            <ListItem key={i}>
              <Text>{`${roomate?.firstName} ${roomate?.lastName}`}</Text>
            </ListItem>
          )}
          <Button transparent>
            <Text>Add Roomate</Text>
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
        <Button full onPress={goToCreateHome}>
          <Text>Create Home</Text>
        </Button>
      </BaseLayout>
  );
}

const styles = StyleSheet.create({
  newEventBtn: {
    marginTop: 15,
    marginBottom: 15
  },
  list: {
    marginTop: 15,
    marginBottom: 15
  }
});

export default Home
