import React, { useState } from 'react';
import { Form, Item, Input, Button, Text } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../hooks/useUser';

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
      .then(() => {
        navigation.navigate('TabOneNavigator', { screen: 'Home' });
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      })
  }

  return (
    <Form>
      <Item>
        <Input placeholder="Name" value={name} onChangeText={setName} />
      </Item>
      <Button full onPress={create}>
        <Text>Create</Text>
      </Button>
    </Form>
  );
}

export default CreateHome
