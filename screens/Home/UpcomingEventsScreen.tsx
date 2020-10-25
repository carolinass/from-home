import React, { FC, useCallback, useEffect, useState } from 'react'
import { Body, Card, CardItem, Left, List, ListItem, Spinner, Text, H3, View } from 'native-base'
import { firestore } from 'firebase'
import { format, isBefore, isAfter } from 'date-fns'
import { RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '../../hooks/useUser'
import { MaterialIcons } from '@expo/vector-icons';

interface IProps {
  roomId?: string
}

const UpcomingEventsScreen: FC<IProps> = ({ roomId }) => {
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

      const eventDocs = await firestore()
        .collection('/events')
        .where('homeId', '==', user?.homeId)
        .where('endDate', '>=', new Date())
        .orderBy('endDate', 'asc')
        .get()

      let eventList = eventDocs.docs.map((event) => ({
        id: event.id,
        ...event.data(),
        room: allRooms.find((room) => room.id === event.data().room),
        people: event.data().people.map((person: any) => allPeople.find((p) => p.id === person))
      }))

      if (roomId) {
        eventList = eventList.filter(e => e.room?.id === roomId)
      }

      setEvents(eventList)

      setRefreshing(false)
    }

    if (refreshing) {
      init()
    }
  }, [user, refreshing])

  return (
    events === null ? (
      <Spinner />
    ) : (
      <View>
        <List
          style={{ marginBottom: 15 }}
          dataArray={[ 'header', ...events]}
          renderItem={({ item, index }) => {
            if (index === 0)
              return (
                <ListItem itemHeader first>
                  <H3 style={{ fontWeight: '500' }}>Upcoming Events</H3>
                </ListItem>
              )
            return <UpcomingEvent {...item} />}
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
        />
        <Text  style={{ marginLeft: 15, marginBottom: 15 }}>No upcoming events...</Text>
      </View>
    )
  )
}

const UpcomingEvent: React.FC<any> = (event) => {
  const { id, title, startDate, endDate } = event
  const { navigate } = useNavigation()

  const isNow = (event: any) => {
    return isBefore(event.startDate.toDate(), Date.now()) && isAfter(event.endDate.toDate(), Date.now())
  }

  const onPress = useCallback(() => {
    navigate('Event', { eventId: id })
  }, [navigate, id])

  return (
    <Card style={{ elevation: 3 }}>
      <CardItem button onPress={onPress}>
        <Left>
          <MaterialIcons name="event" size={24} />
          <Body>
            <Text>{ title }</Text>
            { isNow(event)
              ? <Text note style={{ color: '#0B60FF' }}>Happening now!</Text>
              : <Text note>
                  {format(new Date(startDate.seconds * 1000), 'P')} {format(new Date(startDate.seconds * 1000), 'p')} -{' '}
                  {format(new Date(endDate.seconds * 1000), 'p')}
                </Text>
            }
          </Body>
        </Left>
      </CardItem>
    </Card>
  )
}

export default UpcomingEventsScreen
