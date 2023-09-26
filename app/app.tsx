import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from "react";
import { Text, View } from 'react-native';

export default function app() {
    const getTokenFB = async () => {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log("tokennn", token);
        // await postToApi('/users/1234/tokens', { token });

    }
    useEffect(() => {
        getTokenFB()
    }, [])
    return (
        <View>
            <Text>djsdhshs</Text>
        </View>
    )
}