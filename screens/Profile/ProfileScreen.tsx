import React, { useCallback, useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { firestore } from 'firebase'
import { Body, Button, H1, Icon, Left, ListItem, Right, Switch, Text, Thumbnail } from 'native-base'
import { BaseLayout } from '../../components/layout'
import { useUser } from '../../hooks/useUser'
import { Ionicons } from '@expo/vector-icons'; 

const ProfileScreen: React.FC<DrawerScreenProps<any>> = ({ route }) => {
  const { user } = useUser()
  const [home, setHome] = useState()

  useEffect(() => {
    if (!user || !user?.homeId) return
    const db = firestore()
    db.collection('homes')
      .doc(user?.homeId)
      .get()
      .then((doc) => {
        // @ts-ignore
        setHome({ id: doc.id, ...doc.data()})
      })
  }, [user])

  return (
    <BaseLayout
      title="Profile"
      showBackButton
      rightContent={
        <Button transparent>
          <Icon type="EvilIcons" name="pencil" />
        </Button>
      }
    >
      <Thumbnail
        style={{ margin: 35, marginBottom: 20, alignSelf: 'center', height: 120, width: 120, borderRadius: 60 }}
        source={{ uri: user?.image || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif' }}
      />
      <H1 style={{ textAlign: 'center', paddingBottom: 25, paddingTop: 0 }}>{`${user?.firstName} ${user?.lastName}`}</H1>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "transparent" }}>
            <Ionicons size={24} name="ios-radio-button-on" color="green" />
          </Button>
        </Left>
        <Body>
          {/* @ts-ignore */}
          <Text>Available</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "#FF9501" }}>
            <Icon active name="home" />
          </Button>
        </Left>
        <Body>
          {/* @ts-ignore */}
          <Text>{home?.name}</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Button style={{ backgroundColor: "#F92223" }}>
            <Icon active name="notifications" />
          </Button>
        </Left>
        <Body>
          <Text>Notifications</Text>
        </Body>
        <Right>
          <Switch value={false} />
        </Right>
      </ListItem>
    </BaseLayout>
  )
}

export default ProfileScreen
