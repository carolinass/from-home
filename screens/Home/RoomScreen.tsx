import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { firestore } from 'firebase'
import { Button, H1, Icon } from 'native-base'
import { BaseLayout } from '../../components/layout'
import UpcomingEventsScreen from './UpcomingEventsScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const RoomScreen: React.FC<DrawerScreenProps<any>> = ({ route }) => {
  const { roomId } = route.params
  const [room, setRoom] = useState<null | any>(null)

  const loadEvent = useCallback(() => {
    return firestore()
      .doc(`rooms/${roomId}`)
      .get()
      .then((e) => setRoom(e.data()))
  }, [roomId])

  useEffect(() => {
    loadEvent()
  }, [loadEvent])

  return (
    <BaseLayout
      title="View Room"
      showBackButton
      rightContent={
        <Button transparent>
          <Icon type="EvilIcons" name="pencil" />
        </Button>
      }
    >
      <MaterialCommunityIcons name="door-closed" size={40} style={{ alignSelf: "center", marginTop: 20}} />
      <H1 style={{ textAlign: 'center', paddingBottom: 25, paddingTop: 15 }}>{room?.name}</H1>
      <UpcomingEventsScreen roomId={roomId} />
    </BaseLayout>
  )
}

export default RoomScreen
