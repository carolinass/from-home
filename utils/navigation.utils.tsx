import { NavigationContainerRef } from '@react-navigation/native'
import { createRef } from 'react'

export const navigationRef = createRef<NavigationContainerRef>()

export const navigate = (key: string, params?: object) => navigationRef.current?.navigate(key, params)
