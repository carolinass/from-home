import React, { useState } from 'react';
import { Container, Header, Content, Button, Text } from 'native-base';

// @ts-ignore
const Home = ({ navigation }) => {
  const goToCreateHome = () => {
    navigation.navigate('TabOneNavigator', { screen: 'CreateHome' });
  }

  return (
    <Container>
      <Content>
        <Button full onPress={goToCreateHome}>
          <Text>Create Home</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default Home
