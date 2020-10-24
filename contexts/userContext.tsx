import React, { useState, useEffect, createContext } from 'react'
import * as firebase from 'firebase'

type User = {
  uid: string
  email: string | null
  photoURL: string | null
  profile: {
    firstName: string
    lastName: string
    homeId: string | null
  }
}

export const UserContext = createContext<{ user: User | null,  setUser: (user: any) => void, loadingUser: boolean }>({ user: null, setUser: () => null, loadingUser: true })

// @ts-ignore
export default function UserContextComp({ children, onDoneLoading }) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true) // Helpful, to update the UI accordingly.

  useEffect(() => {
    if (!loadingUser) {
      onDoneLoading()
    }
  }, [onDoneLoading, loadingUser])

  useEffect(() => {
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, email, photoURL } = user

          const profile = await firebase.firestore().doc(`users/${uid}`).get()
          setUser({ uid, email, photoURL, profile: profile.data() as any })
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

  return (
    // @ts-ignore
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  )
}
