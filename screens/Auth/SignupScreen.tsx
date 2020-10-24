import React, { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseLayout } from '../../components/layout';
import { Button, Form, Icon, Input, Item, Label, Spinner, Text, Toast } from 'native-base';
import { useUser } from '../../hooks/useUser';

const SignupScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigation.replace('Root')
    }
  }, [user])

  const onSignup = useCallback(() => {
    if (!firstName || !lastName) {
      Toast.show({ text: 'Please fill first name and last name!', buttonText: 'Okay' });
      return
    }

    setIsLoading(true);
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => firebase.firestore()
        .collection('users')
        .doc(user.user?.uid)
        .set({
          firstName,
          lastName,
          homeId: null
        })
      )
      .catch((error) => {
        const { code, message } = error;
        Toast.show({ text: message, buttonText: 'Okay' });
      })
      .then(() => setIsLoading(true))
  }, [email, password, firstName, lastName, navigation])

  return (
    <BaseLayout title="Sign Up">
      <Form>
        <Item floatingLabel style={{ margin: 10 }} >
          <Label>First Name</Label>
          <Input value={firstName} onChangeText={setFirstName} />
        </Item>

        <Item floatingLabel style={{ margin: 10 }} >
          <Label>Last Name</Label>
          <Input value={lastName} onChangeText={setLastName} />
        </Item>

        <Item floatingLabel style={{ margin: 10 }} >
          <Label>E-Mail</Label>
          <Input keyboardType='email-address' value={email} onChangeText={setEmail} />
        </Item>

        <Item floatingLabel style={{ margin: 10 }}>
          <Label>Password</Label>
          <Input secureTextEntry={true} value={password} onChangeText={setPassword} />
        </Item>

        <Button primary block style={{ margin: 10 }} onPress={onSignup} disabled={isLoading}>
          <Text>Sign Up</Text>
          {isLoading && (<Spinner size="small"/>)}
        </Button>
      </Form>
    </BaseLayout>
  )
}

export default SignupScreen
