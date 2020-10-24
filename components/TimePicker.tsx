import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { format } from 'date-fns'
import { Text, View } from 'native-base'

type TimePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ value = new Date(), onChange, ...props }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <View style={{ margin: 10 }}>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Text>{format(value, 'p')}</Text>
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          {...props}
          mode="time"
          value={value}
          onChange={(e, date) => {
            setIsVisible(false)
            onChange(date)
          }}
        />
      )}
    </View>
  )
}

export default TimePicker
