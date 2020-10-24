import React, { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseLayout } from '../../components/layout';
import { Button, Form, Input, Item, Label, Text, Toast } from 'native-base';
import { useUser } from '../../hooks/useUser';

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
    <BaseLayout title="Login">
      <Form>
        <Item floatingLabel style={{ margin: 10 }} >
          <Label>E-Mail</Label>
          <Input keyboardType='email-address' value={email} onChangeText={setEmail} />
        </Item>

        <Item floatingLabel style={{ margin: 10 }}>
          <Label>Password</Label>
          <Input secureTextEntry={true} value={password} onChangeText={setPassword} />
        </Item>

        <Button primary block style={{ margin: 10 }} onPress={onLogin}>
          <Text>Login</Text>
        </Button>
      </Form>

      <Button transparent onPress={() => navigation.navigate('Signup')}>
        <Text>Don't have an account yet?</Text>
      </Button>
    </BaseLayout>
  )
}

export default LoginScreen
