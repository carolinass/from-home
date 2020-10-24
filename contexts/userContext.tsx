import React, { useState, useEffect, createContext } from 'react'
import * as firebase from 'firebase'

export const UserContext = createContext<{ user: any,  setUser: (user: any) => void, loadingUser: boolean }>({ user: null, setUser: () => null, loadingUser: true })

// @ts-ignore
export default function UserContextComp({ children, onDoneLoading }) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true) // Helpful, to update the UI accordingly.

  useEffect(() => {
    if (!loadingUser) {
      onDoneLoading()
    }
  }, [onDoneLoading, loadingUser])

  useEffect(() => {
    // Listen authenticated user
    // @ts-ignore
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          // @ts-ignore
          setUser({ uid, displayName, email, photoURL })
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
