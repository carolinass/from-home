import React, { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Button, Form, Input, Item, Label, Text, Toast, View } from 'native-base';
import { useUser } from '../../hooks/useUser';
import { Image, ImageBackground } from 'react-native';

const LoginScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      navigation.replace('Root')
    }
  }, [user])

  const onLogin = useCallback(() => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        const { code, message } = error;
        Toast.show({ text: message, buttonText: 'Okay' });
      })
  }, [email, password, navigation])

  return (
    <ImageBackground
      source={{ uri: 'https://blog.vindi.com.br/wp-content/uploads/2020/03/home-office-scaled.jpg' }}
      style={styles.imageBackground}
    >
      <View style={styles.overlay}>
      <Image
        style={styles.logo}
        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/nonow-e7237.appspot.com/o/logo%20(4).png?alt=media&token=e9c927f9-cddb-4d31-8253-5593c513febf' }}
      />
      <Form>
        <Item floatingLabel style={styles.formInput}>
          <Label>E-Mail</Label>
          <Input keyboardType='email-address' value={email} onChangeText={setEmail} />
        </Item>

        <Item floatingLabel style={styles.formInput}>
          <Label>Password</Label>
          <Input secureTextEntry={true} value={password} onChangeText={setPassword} />
        </Item>

        <Button dark block style={styles.loginBtn} onPress={onLogin}>
          <Text>Login</Text>
        </Button>
      </Form>

      <Button transparent onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: 'grey' }}>Don't have an account yet?</Text>
      </Button>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: "center"
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:'rgba(255,255,255,0.8)'
  },
  logo: {
    alignSelf: "center",
    width: 300 ,
    height: 35,
    marginBottom: 30
  },
  loginBtn: {
    margin: 10,
    marginTop: 25
  },
  formInput: {
    margin: 10,
    borderColor: 'black'
  }
});

export default LoginScreen
