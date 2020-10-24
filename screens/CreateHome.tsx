import React, { useState } from 'react';
import { Container, Header, Content, Form, Item, Input, Button, Text } from 'native-base';

const CreateHome = () => {
  const [name, setName] = useState('placeholder')

  const create = () => {
    console.log('create!', name)
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
