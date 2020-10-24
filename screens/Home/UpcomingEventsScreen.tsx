import React, { useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { Body, Card, CardItem, Icon, Left, List, Spinner, Text } from 'native-base'
import { firestore } from 'firebase'
import { format } from 'date-fns'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'

const UpcomingEventsScreen: React.FC<DrawerScreenProps<any>> = () => {
  const [events, setEvents] = useState<any[] | null>(null)
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
          ...event.data(),
          room: allRooms.find((room) => room.id === event.data().room),
          people: event.data().people.map((person: any) => allPeople.find((p) => p.id === person))
        }))
      )
    }
    init()
  }, [user])

  return (
    <BaseLayout title="Upcoming Events">
      {events === null ? (
        <Spinner />
      ) : (
        <>
          <List dataArray={events} renderItem={({ item, index }) => <UpcomingEvent {...item} />} nestedScrollEnabled />
          {events?.length === 0 && <Text>No upcoming events...</Text>}
        </>
      )}
    </BaseLayout>
  )
}

const UpcomingEvent: React.FC<any> = ({ title, room, startDate, endDate, people }) => {
  return (
    <Card style={{ elevation: 3 }}>
      <CardItem>
        <Left>
          <Icon name="ios-happy" />
          <Body>
            <Text>{title}</Text>
            <Text note>
              {format(new Date(startDate.seconds * 1000), 'P')} {format(new Date(startDate.seconds * 1000), 'p')} -{' '}
              {format(new Date(endDate.seconds * 1000), 'p')}
            </Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem>
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
