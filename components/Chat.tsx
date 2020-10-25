import { database } from 'firebase'
import { View } from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { ViewStyle } from 'react-native'
import { GiftedChat, GiftedChatProps } from 'react-native-gifted-chat'
import { useUser } from '../hooks/useUser'

type ChatProps = {
  channel: string
  style?: ViewStyle
}

const Chat: React.FC<ChatProps> = ({ channel, style }) => {
  const { user } = useUser()
  const [messages, setMessages] = useState<GiftedChatProps['messages']>([])

  useEffect(() => {
    const messagesRef = database().ref(`messages/${channel}`)

    const updateMessages = () => {
      messagesRef.on('value', (snapshot) => {
        const values = snapshot.val()
        if (!values || values.length === 0) {
          return setMessages([])
        }
        setMessages(
          (Object.values(snapshot.val()) as any).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      })
    }

    updateMessages()
    return messagesRef.off('value', updateMessages)
  }, [channel])

  const onSend = useCallback(
    (sentMessages: GiftedChatProps['messages']) => {
      if (!sentMessages) {
        return
      }

      const updates: { [key: string]: any } = {}

      sentMessages.forEach((message) => {
        const { key } = database().ref().child(`messages/${channel}`).push()
        updates[`/messages/${channel}/${key}`] = message
      })

      database().ref().update(updates)
    },
    [channel]
  )

  return (
    <View style={{ minHeight: 200, flex: 1, ...style }}>
      <GiftedChat
        inverted
        messages={messages}
        onSend={onSend}
        user={{ _id: user?.uid!, name: `${user?.firstName} ${user?.lastName}` }}
      />
    </View>
  )
}

export default Chat
