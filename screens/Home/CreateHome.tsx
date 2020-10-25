import React, { useState } from 'react';
import { Form, Item, Input, Button, Text } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../../hooks/useUser';
import { BaseLayout } from '../../components/layout';

// @ts-ignore
const CreateHome = ({ navigation }) => {
  const [name, setName] = useState('');
  const { user } = useUser()

  const create = () => {
    const db = firebase.firestore();
    // @ts-ignore
    const userId = user.uid
    db.collection('homes').add({
      name,
      users: [ userId ]
    })
      .then(async (docRef: any) => {
        await db.collection('users').doc(userId).set({
          homeId: docRef.id
        }, { merge: true })

        navigation.navigate('Home', { screen: 'My Home' });
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      })
  }

  return (
    <BaseLayout title="New Home">
      <Form>
        <Item>
          <Input placeholder="Name" value={name} onChangeText={setName} />
        </Item>
        <Button full onPress={create}>
          <Text>Create</Text>
        </Button>
      </Form>
    </BaseLayout>
  );
}

export default CreateHome
