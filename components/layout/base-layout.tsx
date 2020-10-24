import React, { useMemo } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Content, Body, Container, Header, Left, Title, Right, Button, Icon, View } from 'native-base'
import { DrawerActions, useNavigation } from '@react-navigation/native'

type HeaderProps = {
  title: string
  useView?: boolean
}

export const BaseLayout: React.FC<HeaderProps> = ({ children, title, useView = false }) => {
  const { dispatch } = useNavigation()

  const ContentComponent = useMemo<React.FC>(
    () =>
      useView
        ? ({ children: c }) => <View style={{ flex: 1 }}>{c}</View>
        : ({ children: c }) => <Content padder>{c}</Content>,
    [useView]
  )

  return (
    <Container>
      <StatusBar translucent={false} />
      <Header>
        <Left>
          <Button transparent onPress={() => dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>{title}</Title>
        </Body>
        <Right />
      </Header>
      <ContentComponent>{children}</ContentComponent>
    </Container>
  )
}
