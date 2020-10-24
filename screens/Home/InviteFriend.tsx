import React from 'react';
import { H2, Button, Text } from 'native-base';
import { Share } from 'react-native';
import { BaseLayout } from '../../components/layout';
import { useUser } from '../../hooks/useUser';

// @ts-ignore
const InviteFriend = ({ navigation }) => {
  const { user } = useUser()

  const share = async () => {
    try {
      const result = await Share.share({
        message: `Hey! Join our home by signing up to TeamDApp using my home id: ${user?.homeId}`,
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
      <H2>To invite your roomates, share your home ID with them!</H2>
      <Button full onPress={share}>
        <Text>Share</Text>
      </Button>
    </BaseLayout>
  );
}

export default InviteFriend
