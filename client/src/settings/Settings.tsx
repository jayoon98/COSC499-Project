import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Modal,
  Linking,
  ScrollView,
} from 'react-native';
import { Navigation, Button, Title, Header } from '../common/Core';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../colors';
import { clearCredentialsCache } from '../services/login';
import * as Notifications from 'expo-notifications';
import { Button as NativeButton, Alert } from 'react-native';
import Constants from 'expo-constants'; //used for recognizing device I believe
import { _Picker, DomainPicker } from '../common/Picker';
import { deleteSurveyData, getAllSurveyResults } from '../services/survey';
import { Themes } from './Themes';
import firebase from 'firebase';
import { ThemeContext } from '../common/ThemeContext';

// redeclaring this interface here becauses it isn't imported from expo-notifications for some reason
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

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
      >
        <View
          style={{
            display: 'flex',
            marginTop: '55%',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 22,
              minHeight: 180,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text>Schedule Daily Reminders</Text>
            <_Picker
              onChange={(hour, minute) => {
                setDailyTrigger({ ...dailyTrigger, hour, minute });
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Button
                onPress={() => setModalVisible(false)}
                style={{ flexGrow: 1, marginRight: 2 }}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                style={{ flexGrow: 1, marginLeft: 2 }}
                onPress={async () => {
                  await schedulePushNotification(dailyTrigger);
                  setModalVisible(false);
                }}
              >
                <Text>Confirm</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Button
        type="none"
        style={{ ...styles.card }}
        onPress={() => setModalVisible(true)}
      >
        <Text>Schedule a daily reminder to check the app</Text>
      </Button>
      <Button
        type="none"
        style={{ ...styles.card, marginTop: 6 }}
        onPress={async () => {
          await Notifications.cancelAllScheduledNotificationsAsync();
        }}
      >
        <Text>Delete all upcoming notifications</Text>
      </Button>
    </View>
  );
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

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const screen = Dimensions.get('screen');

export type PriorityDomainProps = {
  onChange?: (domain: string) => void;
  domain?: string;
};

export function _PriorityDomain(props?: PriorityDomainProps) {
  const theme = useContext(ThemeContext);
  const [priorityDomain, setPriorityDomain] = useState(
    props.domain ? props.domain : 'not set',
  );
  const [modalVisible, setModalVisible] = useState(false);
  let domaintemp; // in case user chooses cancel button
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
      >
        <View
          style={{
            display: 'flex',
            marginTop: '55%',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',

              margin: 'auto',
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 22,
              minHeight: 180,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text>Set Priority Dimension</Text>

            <DomainPicker onChange={(domain) => (domaintemp = domain)} />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Button
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{ flexGrow: 1, marginRight: 2 }}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                style={{ flexGrow: 1, marginLeft: 2 }}
                onPress={() => {
                  setPriorityDomain(domaintemp);
                  props.domain && props.onChange(domaintemp);
                  setModalVisible(false);
                }}
              >
                <Text>Confirm</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Button
        type="none"
        style={{ ...styles.card, backgroundColor: theme.theme[priorityDomain] }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
          {priorityDomain}
        </Text>
      </Button>
    </View>
  );
}


  

export function Settings() {
  const [username, setUsername] = useState<string>('');
  // TODO: Move this to login.ts or some other service. Trying to
  // avoid API calls in components so it's to debug the server stuff.
  async function getUsername() {
    const user = firebase.auth().currentUser.uid;
    const username = await await (
      await firebase.database().ref(`users/${user}/name`).get()
    ).val();
    return username;
  }

  useEffect(() => {
    (async () => {
      const username = await getUsername();
      if (username) {
        setUsername(username);
      }
    })();
  });

  return (
    <Navigation selected="settings">
      <View style={styles.container}>
        <Header title={`Hello, ${username}`}>
          <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
            <NativeButton
              title="Logout"
              onPress={() => {
                clearCredentialsCache((_) => Actions.replace('login'));
              }}
            />
          </View>
        </Header>

        <ScrollView>
          <View style={styles.settings}>
            <Text style={styles.subHeader}>Set your priority Dimension</Text>
            <_PriorityDomain />



           
            

            <Text style={styles.subHeader}>Daily reminders</Text>

            <_Notifications />

            <Text style={styles.subHeader}>Account</Text>
            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Delete Account Data',
                  'Are you sure you want to delete all completed questionnaire data? \nThis choice can not be undone.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Delete data',
                      onPress: async () => {
                        await deleteSurveyData();
                        Alert.alert('Success', 'Account data deleted');
                      },
                    },
                  ],
                );
              }}
            >
              <Text>Delete User Data</Text>
            </Button>
            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Contact crisis lines',
                  'If you are experiencing a mental health crisis, you can call a crisis line for support',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => Linking.openURL('tel: 555-5555'),
                    },
                  ],
                );
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>Are you in crisis? </Text>
            </Button>
            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Actions.replace('tutorialsurvey');
              }}
            >
              <Text>Tutorial</Text>
            </Button>
            <Text style={styles.subHeader}>Theme</Text>
            <Themes />
          </View>
        </ScrollView>
      </View>
    </Navigation>
  );
}

const styles = StyleSheet.create({
  settings: {
    margin: 12,
  },
  subHeader: {
    marginBottom: 12,
    marginTop: 18,
    fontSize: screen.height * 0.02,
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
    color: Colors.foreground,
  },
  header: {
    height: screen.height * 0.12,
    justifyContent: 'flex-end',
    display: 'flex',

    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f6fa',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  card: {
    padding: 18,
    borderRadius: 14,
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5.6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
