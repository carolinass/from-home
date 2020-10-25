import * as firebase from 'firebase'

const uploadFile = async(file: any, dest: string) => {
  const response = await fetch(file.uri)
  const blob = await response.blob()
  const storageRef = firebase.storage().ref()
  const ref = storageRef.child(dest)
  return ref.put(blob)
}

export default uploadFile
