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

export const UserContext = createContext<{ user: User | null; setUser: (user: any) => void; loadingUser: boolean }>({
  user: null,
  setUser: () => null,
  loadingUser: true
})

const UserContextComp: React.FC<{ onDoneLoading: () => void }> = ({ children, onDoneLoading }) => {
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

  return <UserContext.Provider value={{ user, setUser, loadingUser }}>{children}</UserContext.Provider>
}

export default UserContextComp
