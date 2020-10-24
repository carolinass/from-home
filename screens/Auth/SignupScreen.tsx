import React, { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseLayout } from '../../components/layout';
import { Button, Form, Input, Item, Label, Text, Toast } from 'native-base';
import { useUser } from '../../hooks/useUser';

const SignupScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useUser()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      navigation.replace('Root')
    }
  }, [user])

  const onSignup = useCallback(() => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        const { code, message } = error;
        Toast.show({ text: message, buttonText: 'Okay' });
      })
  }, [email, password, navigation])



  return (
    <BaseLayout title="Sign Up">
      <Form>
        <Item floatingLabel style={{ margin: 10 }} >
          <Label>E-Mail</Label>
          <Input keyboardType='email-address' value={email} onChangeText={setEmail} />
        </Item>

        <Item floatingLabel style={{ margin: 10 }}>
          <Label>Password</Label>
          <Input secureTextEntry={true} value={password} onChangeText={setPassword} />
        </Item>

        <Button primary block style={{ margin: 10 }} onPress={onSignup}>
          <Text>Sign Up</Text>
        </Button>
      </Form>
    </BaseLayout>
  )
}

export default SignupScreen
