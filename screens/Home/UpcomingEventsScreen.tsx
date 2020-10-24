import React, { useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { DeckSwiper } from 'native-base'
import { firestore } from 'firebase'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'

const UpcomingEventsScreen: React.FC<DrawerScreenProps<any>> = () => {
  const [events, setEvents] = useState<any[]>([])
  const { user } = useUser()

  useEffect(() => {
    firestore()
      .collection('events')
      .where('homeId', '==', user?.homeId)
      .where('endDate', '<', new Date())
      .orderBy('startDate')
      .get()
      .then((eventList) => setEvents(eventList.docs.map((event) => event.data())))
  }, [user])

  return <BaseLayout title="Upcoming Events" />
}

export default UpcomingEventsScreen
