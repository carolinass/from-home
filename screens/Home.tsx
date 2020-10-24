import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';

const Home = () => {
  const [name, setName] = useState('placeholder')

  const create = () => {
    console.log('create!')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.container}>
        <Text>Create Home</Text>
        <TextInput
          value={name}
          keyboardType = 'email-address'
          onChangeText={setName}
          placeholder='email'
          placeholderTextColor = 'white'
        />

        <TouchableOpacity
          onPress={create}
        >
          <Text> Create Home </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default Home
