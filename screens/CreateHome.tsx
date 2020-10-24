import React, { useState } from 'react';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';
import * as firebase from 'firebase'
import { useUser } from '../hooks/useUser';
import { BaseLayout } from '../components/layout';

// @ts-ignore
const CreateHome = ({ navigation }) => {
  const [name, setName] = useState('');
  const { user } = useUser()

  const create = () => {
    console.log('user', user)
    // const db = firebase.firestore();
    // db.collection('homes').add({
    //   name,
    // })
    //   .then(() => {
    //     navigation.navigate('TabOneNavigator', { screen: 'Home' });
    //   })
    //   .catch(function(error) {
    //     console.error('Error writing document: ', error);
    //   })
  }

  return (
    <BaseLayout title="Home">
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
