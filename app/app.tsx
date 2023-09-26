import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Text, View} from 'react-native';
import NotifService from '../NotifService';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import uuid from 'react-native-uuid';
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
BackgroundTimer.start();

const getNewUuid = () => uuid.v4();

const format = uuid => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));
const isIOS = Platform.OS === 'ios';
export default function app() {
  const [logText, setLog] = useState('');
  const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
  const [mutedCalls, setMutedCalls] = useState({}); // callKeep uuid: muted
  const [calls, setCalls] = useState({}); // callKeep uuid: number
  const notifi = new NotifService();
  const getTokenFB = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    const unsubscribe = messaging().onMessage(remoteMessage => {
      if (remoteMessage) {
        // notifi.localNotif();
        notifi.createDefaultChannels();
        let number = Number('0336268877');
        displayIncomingCallNow();
      }
    });
  };
  /**----------------------- */
  const log = text => {
    console.info(text);
    setLog(logText + '\n' + text);
  };

  const addCall = (callUUID, number) => {
    setHeldCalls({...heldCalls, [callUUID]: false});
    setCalls({...calls, [callUUID]: number});
  };

  const removeCall = callUUID => {
    const {[callUUID]: _, ...updated} = calls;
    const {[callUUID]: __, ...updatedHeldCalls} = heldCalls;

    setCalls(updated);
    setHeldCalls(updatedHeldCalls);
  };

  const setCallHeld = (callUUID, held) => {
    setHeldCalls({...heldCalls, [callUUID]: held});
  };

  const setCallMuted = (callUUID, muted) => {
    setMutedCalls({...mutedCalls, [callUUID]: muted});
  };

  const displayIncomingCall = number => {
    const callUUID = getNewUuid();
    addCall(callUUID, number);

    log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
  };

  const displayIncomingCallNow = () => {
    displayIncomingCall(getRandomNumber());
  };

  const displayIncomingCallDelayed = () => {
    BackgroundTimer.setTimeout(() => {
      displayIncomingCall(getRandomNumber());
    }, 3000);
  };

  const answerCall = ({callUUID}) => {
    const number = calls[callUUID];
    log(`[answerCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.startCall(callUUID, number, number);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  const didPerformDTMFAction = ({callUUID, digits}) => {
    const number = calls[callUUID];
    log(
      `[didPerformDTMFAction] ${format(
        callUUID,
      )}, number: ${number} (${digits})`,
    );
  };

  const didReceiveStartCallAction = ({handle}) => {
    if (!handle) {
      // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
      return;
    }
    const callUUID = getNewUuid();
    addCall(callUUID, handle);

    log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

    RNCallKeep.startCall(callUUID, handle, handle);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  const didPerformSetMutedCallAction = ({muted, callUUID}) => {
    const number = calls[callUUID];
    log(
      `[didPerformSetMutedCallAction] ${format(
        callUUID,
      )}, number: ${number} (${muted})`,
    );

    setCallMuted(callUUID, muted);
  };

  const didToggleHoldCallAction = ({hold, callUUID}) => {
    const number = calls[callUUID];
    log(
      `[didToggleHoldCallAction] ${format(
        callUUID,
      )}, number: ${number} (${hold})`,
    );

    setCallHeld(callUUID, hold);
  };

  const endCall = ({callUUID}) => {
    const handle = calls[callUUID];
    log(`[endCall] ${format(callUUID)}, number: ${handle}`);

    removeCall(callUUID);
  };

  const hangup = callUUID => {
    RNCallKeep.endCall(callUUID);
    removeCall(callUUID);
  };

  const setOnHold = (callUUID, held) => {
    const handle = calls[callUUID];
    RNCallKeep.setOnHold(callUUID, held);
    log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

    setCallHeld(callUUID, held);
  };

  const setOnMute = (callUUID, muted) => {
    const handle = calls[callUUID];
    RNCallKeep.setMutedCall(callUUID, muted);
    log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

    setCallMuted(callUUID, muted);
  };

  const updateDisplay = callUUID => {
    const number = calls[callUUID];
    // Workaround because Android doesn't display well displayName, se we have to switch ...
    if (isIOS) {
      RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    } else {
      RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    }

    log(`[updateDisplay: ${number}] ${format(callUUID)}`);
  };
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
