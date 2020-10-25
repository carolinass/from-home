import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { format } from 'date-fns'
import { Button, Text, View } from 'native-base'
import { Platform } from 'react-native'

type TimePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ value = new Date(), onChange, ...props }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <View style={{ margin: 10 }}>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Text>{!isVisible && format(value, 'p')}</Text>
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          {...props}
          style={{ minWidth: 200 }}
          mode="time"
          value={value}
          onChange={(e, date) => {
            if (Platform.OS === 'android') {
              setIsVisible(false)
            }
            onChange(date)
          }}
        />
      )}

      {isVisible && Platform.OS !== 'android' && (
        <Button light onPress={() => setIsVisible(false)}>
          <Text>Apply</Text>
        </Button>
      )}
    </View>
  )
}

export default TimePicker
