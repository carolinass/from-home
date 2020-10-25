import React, { useState, useEffect, createContext } from 'react'
import * as firebase from 'firebase'

type User = {
  uid: string
  email: string | null
  photoURL: string | null
  firstName: string
  lastName: string
  homeId: string | null
  expoPushToken?: string
  connectedGoogleAccounts?: string[]
}

export const UserContext = createContext<{ user: User | null; setUser: (user: any) => void; loadingUser: boolean }>({
  user: null,
  setUser: () => null,
  loadingUser: true
})

const UserContextComp: React.FC<{ onDoneLoading: () => void; expoPushToken?: string }> = ({
  children,
  onDoneLoading,
  expoPushToken
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true) // Helpful, to update the UI accordingly.

  useEffect(() => {
    if (!loadingUser) {
      onDoneLoading()
    }
  }, [onDoneLoading, loadingUser])

  useEffect(() => {
    const unsubscriber = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in.
          const { uid, email, photoURL } = firebaseUser

          firebase
            .firestore()
            .doc(`users/${uid}`)
            .onSnapshot((doc) => {
              setUser({ uid, email, photoURL, ...(doc.data() as any) })
            })
          // .get()
        } else setUser(null)
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false)
      }
    })

    // Unsubscribe auth listener on unmount
    return () => unsubscriber()
  }, [])

  useEffect(() => {
    if (user && expoPushToken && user.expoPushToken !== expoPushToken) {
      firebase.firestore().doc(`users/${user.uid}`).update({ expoPushToken })
    }
  }, [expoPushToken, user])

  return <UserContext.Provider value={{ user, setUser, loadingUser }}>{children}</UserContext.Provider>
}

export default UserContextComp
