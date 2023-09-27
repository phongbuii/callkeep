/**
 * @format
 */

import { AppRegistry } from 'react-native';
import app from './app/app.tsx';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import AppRputer from './app/app.tsx';
import CallService from './app/component/serviceCall.js';
import RNCallKeep from 'react-native-callkeep';
import _BackgroundTimer from 'react-native-background-timer';
import { useEffect } from 'react';
RNCallKeep.setup({
    ios: {
        appName: 'CallKeepDemo',
    },
    android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        additionalPermissions: [],
    },
});
_BackgroundTimer.start();
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    CallService().displayIncomingCallNow()
});


AppRegistry.registerComponent(appName, () => app);
