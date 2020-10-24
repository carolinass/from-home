import React, { useState } from 'react';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';
import * as firebase from 'firebase'

// @ts-ignore
const CreateHome = ({ navigation }) => {
  const [name, setName] = useState('');

  const create = () => {
    const db = firebase.firestore();
    db.collection('homes').add({
      name,
      users: []
    })
      .then(() => {
        navigation.navigate('TabOneNavigator', { screen: 'Home' });
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      })
  }

  return (
    <Container>
      <Content>
        <Form>
          <Item>
            <Input placeholder="Name" value={name} onChangeText={setName} />
          </Item>
          <Button full onPress={create}>
            <Text>Create</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

export default CreateHome
