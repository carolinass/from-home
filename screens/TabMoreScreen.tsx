import { Left, Right, ListItem, Text, List, Icon } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import * as firebase from 'firebase';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseLayout } from '../components/layout';
import { useUser } from '../hooks/useUser';

const TabMoreScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const onLogout = useCallback(() => {
    firebase.auth().signOut()
  }, [navigation])

  const { user } = useUser()
  useEffect(() => {
    if (!user) {
      navigation.replace('Auth')
    }
  }, [user])

  return (
    <BaseLayout title="More">
      <List>
        <ListItem button onPress={onLogout}>
          <Left>
            <Text>Logout</Text>
          </Left>
          <Right>
              <Icon name="arrow-forward" />
          </Right>
        </ListItem>
      </List>
    </BaseLayout>
  );
}

export default TabMoreScreen