import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { firestore } from 'firebase'
import { Button, Card, CardItem, Col, Grid, H1, Icon, Spinner, Text, View } from 'native-base'
import { format, formatDistance } from 'date-fns'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'

const EventScreen: React.FC<DrawerScreenProps<any>> = ({ route }) => {
  const { user } = useUser()
  const { eventId } = route.params

  const [event, setEvent] = useState<null | any>(null)
  const [room, setRoom] = useState<null | any>(null)
  const [people, setPeople] = useState<any[]>([])

  const [actionLoading, setActionLoading] = useState(false)

  const loadEvent = useCallback(() => {
    return firestore()
      .doc(`events/${eventId}`)
      .get()
      .then((e) => setEvent(e.data()))
  }, [eventId])

  useEffect(() => {
    loadEvent()
  }, [loadEvent])

  useEffect(() => {
    if (event) {
      firestore()
        .doc(`rooms/${event.room}`)
        .get()
        .then((r) => setRoom(r.data()))
    }
  }, [event])

  useEffect(() => {
    if (event?.people.length === 0) {
      setPeople([])
    } else if (event) {
      firestore()
        .collection(`users`)
        .where(firestore.FieldPath.documentId(), 'in', event.people)
        .get()
        .then((u) => setPeople(u.docs.map((p) => ({ id: p.id, ...p.data() }))))
    }
  }, [event])

  const onRemoveMe = useCallback(async () => {
    setActionLoading(true)

    await firestore()
      .doc(`events/${eventId}`)
      .update({ people: firestore.FieldValue.arrayRemove(user?.uid) })

    await loadEvent()
    setActionLoading(false)
  }, [eventId, user, loadEvent])

  const onAddMe = useCallback(async () => {
    setActionLoading(true)

    await firestore()
      .doc(`events/${eventId}`)
      .update({ people: firestore.FieldValue.arrayUnion(user?.uid) })

    await loadEvent()
    setActionLoading(false)
  }, [eventId, user, loadEvent])

  return (
    <BaseLayout
      title="View Event"
      showBackButton
      rightContent={
        <Button transparent>
          <Icon type="EvilIcons" name="pencil" />
        </Button>
      }
    >
      <H1 style={{ textAlign: 'center', padding: 20 }}>{event?.title}</H1>
      <Grid style={{ flexGrow: 0 }}>
        <Col>
          <Card>
            <CardItem style={{ paddingBottom: 0, paddingTop: 20 }}>
              <Text style={{ color: '#6673ab' }}>
                {formatDistance(
                  new Date((event?.endDate.seconds ?? 0) * 1000),
                  new Date((event?.startDate.seconds ?? 0) * 1000)
                )}
              </Text>
            </CardItem>
            <CardItem>
              <Text note>Duration</Text>
            </CardItem>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardItem style={{ paddingBottom: 0, paddingTop: 20 }}>
              <Text style={{ color: '#dfc400' }}>{event?.people?.length}</Text>
            </CardItem>
            <CardItem>
              <Text note>People</Text>
            </CardItem>
          </Card>
        </Col>
      </Grid>

      <Text note style={{ marginTop: 10 }}>
        When?
      </Text>
      <Text>
        {format(new Date((event?.startDate.seconds ?? 0) * 1000), 'P')}{' '}
        {format(new Date((event?.startDate.seconds ?? 0) * 1000), 'p')} -{' '}
        {format(new Date((event?.endDate.seconds ?? 0) * 1000), 'p')}
      </Text>
      <Text note style={{ marginTop: 10 }}>
        Where?
      </Text>
      <Text>{room?.name}</Text>
      <Text note style={{ marginTop: 10 }}>
        Who?
      </Text>
      <Text>
        {people.map((person) => `${person.firstName} ${person.lastName}`).join(', ')}
        {people.length === 0 && 'Nobody'}
      </Text>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {event?.people.includes(user?.uid) ? (
          <>
            <Button danger style={{ marginTop: 20 }} onPress={onRemoveMe} disabled={actionLoading} block>
              <Text>I changed my mind, remove me!</Text>
              {actionLoading && <Spinner size="small" />}
            </Button>
          </>
        ) : (
          <Button style={{ marginTop: 20 }} onPress={onAddMe} disabled={actionLoading} block>
            <Text>I want to join!</Text>
            {actionLoading && <Spinner size="small" />}
          </Button>
        )}
      </View>
    </BaseLayout>
  )
}

export default EventScreen
