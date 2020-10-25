import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { Body, Card, CardItem, Left, List, Spinner, Text } from 'native-base'
import { firestore } from 'firebase'
import { format } from 'date-fns'
import { RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'
import { MaterialIcons } from '@expo/vector-icons'; 

const UpcomingEventsScreen: React.FC<DrawerScreenProps<any>> = () => {
  const [events, setEvents] = useState<any[] | null>(null)
  const [refreshing, setRefreshing] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    const init = async () => {
      const allRooms = await firestore()
        .collection(`/rooms`)
        .where('homeId', '==', user?.homeId)
        .get()
        .then((data) => data.docs.map((room) => ({ id: room.id, ...room.data() })))

      const allPeople = await firestore()
        .collection(`/users`)
        .where('homeId', '==', user?.homeId)
        .get()
        .then((data) => data.docs.map((u) => ({ id: u.id, ...u.data() })))

      const eventList = await firestore()
        .collection('/events')
        .where('homeId', '==', user?.homeId)
        .where('endDate', '>=', new Date())
        .orderBy('endDate', 'asc')
        .get()

      setEvents(
        eventList.docs.map((event) => ({
          id: event.id,
          ...event.data(),
          room: allRooms.find((room) => room.id === event.data().room),
          people: event.data().people.map((person: any) => allPeople.find((p) => p.id === person))
        }))
      )

      setRefreshing(false)
    }

    if (refreshing) {
      init()
    }
  }, [user, refreshing])

  return (
    <BaseLayout title="Upcoming Events" useView>
      {events === null ? (
        <Spinner />
      ) : (
        <>
          <List
            dataArray={events}
            renderItem={({ item, index }) => <UpcomingEvent {...item} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
          />
          {events?.length === 0 && <Text>No upcoming events...</Text>}
        </>
      )}
    </BaseLayout>
  )
}

const UpcomingEvent: React.FC<any> = ({ id, title, room, startDate, endDate, people }) => {
  const { navigate } = useNavigation()

  const onPress = useCallback(() => {
    navigate('Event', { eventId: id })
  }, [navigate, id])

  return (
    <Card style={{ elevation: 3 }}>
      <CardItem button onPress={onPress}>
        <Left>
          <MaterialIcons name="event" size={24} />
          <Body>
            <Text>{title}</Text>
            <Text note>
              {format(new Date(startDate.seconds * 1000), 'P')} {format(new Date(startDate.seconds * 1000), 'p')} -{' '}
              {format(new Date(endDate.seconds * 1000), 'p')}
            </Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem button onPress={onPress}>
        <Text>
          Room: {room.name}
          {`\n`}
          People: {people.map((person) => `${person.firstName} ${person.lastName}`).join(',')}
        </Text>
      </CardItem>
    </Card>
  )
}

export default UpcomingEventsScreen
