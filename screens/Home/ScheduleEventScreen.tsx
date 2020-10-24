import React from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { Form } from 'native-base'
import { BaseLayout } from '../../components/layout'

const ScheduleEventScreen: React.FC<DrawerScreenProps<any>> = () => {
  return (
    <BaseLayout title="Schedule Event">
      <Form />
    </BaseLayout>
  )
}

export default ScheduleEventScreen
