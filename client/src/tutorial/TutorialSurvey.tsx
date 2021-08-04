import Constants from 'expo-constants'; 
import React, {Component, useState, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom'
import modal from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'

import { Navigation, Header } from '../common/Core';
import {
  CompletedSurveys,
  CompletedSurveysProps,
} from '../survey/CompletedSurveys';
import { DomainSelection } from '../survey/DomainSelection';
import { View, StyleSheet, ScrollView, StatusBar, Modal } from 'react-native';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import { Actions } from 'react-native-router-flux';
import { Circle } from 'react-native-svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
// -------------------------------------------------------------
 interface Notification {
  date: number;
  request: Notifications.NotificationRequest;
}

// a trigger that will cause the notif to be delivered once per day
interface DailyTriggerInput {
  channelId?: string;
  hour: number;
  minute: number;
  repeats: true;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function _Notifications() {
  const [expoPushToken, setExpoPushToken] = useState('');
  // was 'useState(false)' before, I think that was messing with my types
  const [notification, setNotification] = useState<Notification>();
  const notificationListener = useRef<Object>();
  const responseListener = useRef<Object>();
  const [modalVisible, setModalVisible] = useState(false);

  const [dailyTrigger, setDailyTrigger] = useState<DailyTriggerInput>({
    hour: 0,
    minute: 0,
    repeats: true,
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      },
    );

    return () => {
      // also dealing with TS errors with "as any" here
      Notifications.removeNotificationSubscription(notificationListener as any);
      Notifications.removeNotificationSubscription(responseListener as any);
    };
  }, []);
}

async function schedulePushNotification(dailyTrigger: DailyTriggerInput) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Health Circles ⭕',
        body: 'Time to check in with your health!',
      },
      trigger: dailyTrigger,
    });
  } catch (error) {
    console.warn(`Could not schedule notification: ${error}`);
  }
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
// -------------------------------------------------------------




export function TutorialSurvey() {
  const iconProps = { size: 40, color: '#888' };
  
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

  React.useEffect(() => {
    if (canStart) {
      start();
    }
  }, [canStart]);

  const handleOnStart = () => null;
  const handleOnStop = () => Actions.replace('tutorialcircles');
  const handleOnStepChange = () => null;

  React.useEffect(() => {
    eventEmitter.on('start', handleOnStart);
    eventEmitter.on('stop', handleOnStop);
    eventEmitter.on('stepChange', handleOnStepChange);

    return () => {
      eventEmitter.off('start', handleOnStart);
      eventEmitter.off('stop', handleOnStop);
      eventEmitter.off('stepChange', handleOnStepChange);
    };
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    
  
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content"/>
      

      <Navigation>

        <View style={styles.container}>
          <ScrollView>
            <TourGuideZone
            
              zone={3}
              
              keepTooltipPosition

              text={
                'Click on a health dimension to learn your health priorities.'
              }
              borderRadius={16}
            >
              

              <Header title="Questionnaires" />
              <DomainSelection />
            </TourGuideZone>
            <TourGuideZone
             
              zone={4}
              
              keepTooltipPosition
              
              text={
                'By completing a health survey, you get real-time and historically prioritized information about your health.'
              }
              borderRadius={16}
            >
          
              <CompletedSurveys />
{/*               
            <View style={{borderWidth: 5}}>
              {/* <Modal
                  transparent={true}
                  visible={modalVisible}
                  onDismiss={() => setModalVisible(true)}
                >   */}
                  <FontAwesomeIcon style={{marginLeft:150, margin:20}} icon={faArrowAltCircleDown} color="cornflowerblue" size={28}/>     
              {/* </Modal>
            </View> */}

            </TourGuideZone>
          </ScrollView>
        </View>
        
        <TourGuideZone
          
          zone={2}
          
          keepTooltipPosition
          text={
            'Navigation bar.'
          }
          style={{ alignItems: 'flex-end', height: 200, bottom: 200 }}
          >
            
         
        </TourGuideZone>
       
      </Navigation>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
    
  },
});
