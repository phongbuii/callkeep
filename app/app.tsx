import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import NotifService from '../NotifService';

import BackgroundTimer from 'react-native-background-timer';
import uuid from 'react-native-uuid';
import RNCallKeep from 'react-native-callkeep';
import CallService from './component/serviceCall';





export default function AppRputer() {

  const notifi = new NotifService();
  const getTokenFB = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    const unsubscribe = messaging().onMessage(remoteMessage => {
      if (remoteMessage) {
        // notifi.localNotif();
        CallService().displayIncomingCallDelayed()
        // notifi.createDefaultChannels();
        let number = Number('0336268877');

      }
    });
  };
  /**----------------------- */

  /**------------------- */
  useEffect(() => {
    getTokenFB();
  }, []);

  return (
    <View>
      <Text>djsdhshs</Text>
    </View>
  );
}
