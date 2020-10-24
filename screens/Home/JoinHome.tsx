import React, { useState } from 'react';
import { Form, Item, Input, Button, Text } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../../hooks/useUser';
import { BaseLayout } from '../../components/layout';

// @ts-ignore
const JoinHome = ({ navigation }) => {
  const [homeId, setHomeId] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser()

  const join = () => {
    const db = firebase.firestore();
    // @ts-ignore
    const userId = user.uid
    db.collection('homes').doc(homeId).get()
      .then(async doc => {
        // TODO: USE BATCH UPDATE!!!
        // update user
        await db.collection('users').doc(userId).set({
          homeId: doc.id
        }, { merge: true })

        // update home
        const currentUsers = doc.data()?.users
        await db.collection('homes').doc(homeId).set({
          users: [ ...currentUsers, user?.uid]
        }, { merge: true })

        navigation.navigate('Home', { screen: 'MyHome' });
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  return (
    <BaseLayout title="Join Home">
      <Form>
        <Item>
          <Input placeholder="Home ID" value={homeId} onChangeText={setHomeId} />
        </Item>
        <Text>{error}</Text>
        <Button full onPress={join}>
          <Text>Join</Text>
        </Button>
      </Form>
    </BaseLayout>
  );
}

export default JoinHome
