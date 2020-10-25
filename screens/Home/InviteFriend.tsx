import React from 'react';
import { H3, Button, Text } from 'native-base';
import { Share } from 'react-native';
import { BaseLayout } from '../../components/layout';
import { useUser } from '../../hooks/useUser';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// @ts-ignore
const InviteFriend = ({ navigation }) => {
  const { user } = useUser()

  const share = async () => {
    try {
      const result = await Share.share({
        message: `Hey! Join our home by signing up to FromHome using my home id: ${user?.homeId}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <BaseLayout title="Invite Roomate">
      <H3 style={styles.text}>Share your home ID with your friends to invite them to join your home!</H3>
      <Button block onPress={share}>
        <Ionicons size={20} name="ios-share-alt" color="white"/>
        <Text>Share</Text>
      </Button>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center'
  },
});

export default InviteFriend
