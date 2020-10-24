import React, { useState } from 'react';
import { Container, Header, Content, Button, Text } from 'native-base';
import { BaseLayout } from '../components/layout';

// @ts-ignore
const Home = ({ navigation }) => {
  const goToCreateHome = () => {
    navigation.navigate('TabOneNavigator', { screen: 'CreateHome' });
  }

  return (
    <BaseLayout title="Home">
      <Button full onPress={goToCreateHome}>
        <Text>Create Home</Text>
      </Button>
    </BaseLayout>
  );
}

export default Home
