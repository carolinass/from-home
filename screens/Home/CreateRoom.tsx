import React, { useState } from 'react';
import { Form, Item, Input, Button, Text } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../../hooks/useUser';
import { BaseLayout } from '../../components/layout';

// @ts-ignore
const CreateRoom = ({ navigation }) => {
  const [name, setName] = useState('');
  const { user } = useUser()

  const create = () => {
    const db = firebase.firestore();
    // @ts-ignore
    const homeId = user.homeId
    db.collection('homes').add({
      name,
      homeId
    })
      .then(() => {
        navigation.navigate('TabOneNavigator', { screen: 'Home' });
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      })
  }

  return (
    <BaseLayout title="New Room">
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

export default CreateRoom
