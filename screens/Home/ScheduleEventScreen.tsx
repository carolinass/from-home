import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { Button, DatePicker, Form, Icon, Input, Item, Label, Picker, Text, Toast } from 'native-base'
import firebase, { firestore } from 'firebase'
import { addMinutes } from 'date-fns'
import MultiSelect from 'react-native-multiple-select'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'
import TimePicker from '../../components/TimePicker'

const ScheduleEventScreen: React.FC<DrawerScreenProps<any>> = ({ navigation }) => {
  const { user } = useUser()

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [availableRooms, setAvailableRooms] = useState<any[]>([])

  const [selectedPeople, setSelectedPeople] = useState<string[]>([user?.uid ?? ''])
  const [availablePeople, setAvailablePeople] = useState<{ id: string; name: string }[]>([])

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => new Date())
  const [startTime, setStartTime] = useState<Date | undefined>(() => new Date())
  const [endTime, setEndTime] = useState<Date | undefined>(() => addMinutes(new Date(), 30))

  useEffect(() => {
    const db = firebase.firestore()

    db.collection('rooms')
      .where('homeId', '==', user?.homeId)
      .get()
      .then((rooms) => setAvailableRooms(rooms.docs.map((room) => ({ ...room.data(), id: room.id }))))
  }, [user])

  useEffect(() => {
    const db = firebase.firestore()

    db.doc(`homes/${user?.homeId}`)
      .get()
      .then((home) => {
        const peopleIds = home.data()?.users ?? []
        return db.collection('users').where(firestore.FieldPath.documentId(), 'in', peopleIds).get()
      })
      .then((people) => {
        const mappedPeople = people.docs.map((person) => ({
          id: person.id,
          name: `${person.data().firstName} ${person.data().lastName}`
        }))

        setAvailablePeople(mappedPeople)
      })
  }, [user])

  const onSubmit = useCallback(async () => {
    const errorMessages = []
    if (!title) {
      errorMessages.push('Please enter a title')
    }
    if (!selectedRoom) {
      errorMessages.push('Please select a room')
    }
    if (!date) {
      errorMessages.push('Please choose a date')
    }
    if (!startTime) {
      errorMessages.push('Please select a start time')
    }
    if (!endTime) {
      errorMessages.push('Please select an end time')
    }
    if (selectedPeople.length === 0) {
      errorMessages.push('Please choose at least one person')
    }

    if (errorMessages.length) {
      return Toast.show({ text: errorMessages.join('\n'), buttonText: 'Okay' })
    }

    await firebase.firestore().collection('events').add({
      title,
      room: selectedRoom,
      date,
      startTime,
      endTime,
      people: selectedPeople
    })

    return navigation.navigate('Home')
  }, [title, selectedPeople, date, startTime, endTime, selectedRoom, navigation])

  return (
    <BaseLayout title="Schedule Event">
      <Form>
        <Item floatingLabel>
          <Label>Event Title</Label>
          <Input onChangeText={setTitle} value={title} />
        </Item>

        <Item fixedLabel>
          <Label>Select Room</Label>
          <Picker
            mode="dropdown"
            iosHeader="Select the room"
            iosIcon={<Icon name="arrow-down" />}
            placeholder="Select Room"
            selectedValue={selectedRoom}
            onValueChange={setSelectedRoom}
          >
            {availableRooms.map((room: any) => (
              <Picker.Item label={room.name} key={room.id} value={room.id} />
            ))}
          </Picker>
        </Item>

        <Item fixedLabel>
          <Label>Date</Label>
          <DatePicker
            defaultDate={date}
            minimumDate={new Date()}
            locale="en"
            placeHolderText="Select date..."
            onDateChange={setDate}
          />
        </Item>

        <Item fixedLabel>
          <Label>Start Time</Label>
          <TimePicker value={startTime} onChange={setStartTime} />
        </Item>

        <Item fixedLabel>
          <Label>End Time</Label>
          <TimePicker value={endTime} onChange={setEndTime} />
        </Item>

        <MultiSelect
          items={availablePeople}
          onSelectedItemsChange={setSelectedPeople}
          selectedItems={selectedPeople}
          selectText="Select People"
          styleMainWrapper={{ margin: 10 }}
          uniqueKey="id"
          submitButtonText="Confirm People"
        />

        <Button style={{ margin: 10 }} onPress={onSubmit}>
          <Text>Schedule Event</Text>
        </Button>
      </Form>
    </BaseLayout>
  )
}

export default ScheduleEventScreen
