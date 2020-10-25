import React, { useState, useEffect } from 'react';
import { Button, Text, H3, List, ListItem } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../../hooks/useUser';
import { BaseLayout } from '../../components/layout';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { isBefore, isAfter } from 'date-fns'

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
  const [events, setEvents] = useState<any[]>([])

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
    navigation.navigate('Home', { screen: 'Invite Friend' });
  }

  const goToNewEvent = () => {
    navigation.navigate('Home', { screen: 'Schedule Event' });
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

  const getTodayEvents = (homeId: string) => {
    const db = firebase.firestore();
    db.collection('events')
      .where('startDate', '<=', new Date())
      .where('homeId', '==', homeId)
      .onSnapshot((querySnapshot) => {
        const events: React.SetStateAction<any[]> = [];
        querySnapshot.forEach((doc) => {
          events.push({ id: doc.id, ...doc.data() });
        });
        setEvents(events)
      }
    );
  }

  const isRoomAvailable = (room: any) => {
    for (const event of events) {
      if (event.room === room.id) {
        if (isBefore(event.startDate.toDate(), Date.now()) && isAfter(event.endDate.toDate(), Date.now())) {
          return event
        }
      }
    }
    return null
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
      getTodayEvents(doc.id)
    })
  }, [user])

  const roomItem = (room: any, i: number) => {
    const roomEvent = isRoomAvailable(room)
    const roomText = roomEvent ? `${room.name} - ${roomEvent['title']}` : room.name
    return (
      <ListItem key={i}>
        {roomEvent
          ? <MaterialIcons name="event-busy" size={24} color="#F04747" style={styles.roomStatus} />
          : <MaterialIcons name="event-available" size={24} color="green" style={styles.roomStatus} />
        }
        <Text>{roomText}</Text>
      </ListItem>
    )
  }

  return (
    user && user.homeId && home ?
      <BaseLayout title={home.name}>
        <Button block onPress={goToNewEvent} style={styles.extraMargin}>
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
            roomItem(room, i)
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
  },
  roomStatus: {
    marginRight: 10
  }
});

export default Home
