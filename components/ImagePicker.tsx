import React, { useState, useEffect, FC } from 'react';
import { Button, Image, View, Platform, Pressable } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import uploadFile from '../services/uploadService';
import { useUser } from '../hooks/useUser';

interface IProps {
  onPickImage: (img: any) => any
}

const ImagePicker: FC<IProps> = ({ onPickImage, children }) => {
  const { user } = useUser()

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })()
  }, [])

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    const dest = `/avatars/avatar-${user?.uid}`

    const uploadTask = await uploadFile(result, dest)

    uploadTask.ref.getDownloadURL().then(
      (downloadURL: string) => {
        onPickImage(downloadURL)
      })
  };

  return (
    <Pressable onPress={pickImage}>
      { children }
    </Pressable>
  );
}

export default ImagePicker
