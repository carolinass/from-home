import React, { useState, useEffect } from 'react';
import { Button, Text, View, H3, List, ListItem } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../../hooks/useUser';
import { BaseLayout } from '../../components/layout';

interface Home {
  id: string
  name: string
  users: string[]
}

// @ts-ignore
const Home = ({ navigation }) => {
  const { user } = useUser()
  const [home, setHome] = useState<Home>()
  const [roomates, setRoomates] = useState<any[]>([])
  const [fabState, setFabState] = useState(false)

  const goToCreateHome = () => {
    navigation.navigate('TabOneNavigator', { screen: 'CreateHome' });
  }

  const newEvent = () => {
    console.log('new event')
  }

  const getRoomates = async (home: Home) => {
    const db = firebase.firestore();
    const roomates = await Promise.all(home.users.map(async roomateId => {
      const doc = await db.collection("users").doc(roomateId).get();
      return { id: doc.id, ...doc.data()}
    }))

    // @ts-ignore
    setRoomates(roomates.filter(rommate => rommate.id !== user.uid))
  }

  useEffect(() => {
    // @ts-ignore
    const userId = user.uid
    const db = firebase.firestore();
    db.collection('homes').where('users', 'array-contains', userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const home = { id: doc.id, ...doc.data() }
          // @ts-ignore
          setHome(home)
          getRoomates(home as Home)
        });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }, [])

  return (
    home ?
      <BaseLayout title={home.name}>
        <Button block onPress={newEvent}>
          <Text>New Event</Text>
        </Button>
        <List>
          <ListItem itemHeader first>
            <H3>ROOMIES</H3>
          </ListItem>
          {roomates.map((roomate, i) =>
            <ListItem key={i}>
              <Text>{`${roomate?.firstName} ${roomate?.lastName}`}</Text>
            </ListItem>
          )}
        </List>
        <List>
          <ListItem itemHeader first>
            <H3>ROOMS</H3>
          </ListItem>
          <ListItem>
            <Text>Room 1</Text>
          </ListItem>
        </List>
      </BaseLayout>
    :
      <View>
        <Button full onPress={goToCreateHome}>
          <Text>Create Home</Text>
        </Button>
      </View>
  );
}

export default Home
