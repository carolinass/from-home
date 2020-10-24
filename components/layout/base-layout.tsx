import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Content, Body, Container, Header, Left, Title, Right, Button, Icon } from 'native-base'
import { DrawerActions, useNavigation } from '@react-navigation/native'

type HeaderProps = {
  title: string
}

export const BaseLayout: React.FC<HeaderProps> = ({ children, title }) => {
  const { dispatch } = useNavigation()

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
      <Content padder>{children}</Content>
    </Container>
  )
}
