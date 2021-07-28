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
  TouchableOpacity,
} from 'react-native';
import { Navigation, Button, Title, Header } from '../common/Core';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../colors';
import { clearCredentialsCache } from '../services/login';
import * as Notifications from 'expo-notifications';
import { Button as NativeButton, Alert } from 'react-native';
import Constants from 'expo-constants'; //used for recognizing device I believe
import { _Picker, DomainPicker } from '../common/Picker';
import { deleteSurveyData, getAllSurveyResults, SurveyModel } from '../services/survey';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Themes } from './Themes';
import firebase from 'firebase';
import { ThemeContext } from '../common/ThemeContext';
import {ActivitiesCalendarProps} from '../calendar/Calendar';
import {getActivities,  ActivityAgenda} from '../services/activities';

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
  const [t, setTime] = useState(new Date())
  const [show, setShow] = useState(false);
  const showTimepicker = () => {
    setShow(true);
  };
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
  const onChange = (_, timestamp: Date) => {

      setShow(Platform.OS === 'ios');
      setTime(timestamp);
      setDailyTrigger({ ...dailyTrigger, hour: timestamp.getHours(), minute: timestamp.getMinutes() })
    };
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
            <View style={{
              display: 'flex',


            }}>
              <Button style={{
                display: 'flex',

              }} onPress={showTimepicker}  >
                <Text style={{

                  justifyContent: 'center'
                }}>
                  {t.getHours()} : {t.getMinutes()}</Text>

              </Button>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={t}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
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
  readOnly?: boolean;
};

export function _PriorityDomain(props?: PriorityDomainProps) {
  const theme = useContext(ThemeContext);
  const [priorityDomain, setPriorityDomain] = useState(
    props.domain ? props.domain : 'not set',
  );

  async function getPriorityDomain() {
    const user = firebase.auth().currentUser.uid;
    const prioDomain = await await (
      await firebase.database().ref(`users/${user}/priorityDomain`).get()
    ).val();
    return prioDomain;
  }
  async function updatePriorityDomain(domain) {
    console.log("Updated user domain to: ", domain);
    const user = firebase.auth().currentUser.uid;
    await firebase.database().ref(`users/${user}`).update({ 'priorityDomain': domain });
  }

  async function setDefaultPriorityDomain() {
    const user = firebase.auth().currentUser.uid;
    await firebase.database().ref(`users/${user}`).update({ 'priorityDomain': "not set" });
  }

  useEffect(() => {
    (async () => {
      if (!props.readOnly) {
        const priorityDomain = await getPriorityDomain();
        if (priorityDomain) {
          setPriorityDomain(priorityDomain);
        }
        else {
          setDefaultPriorityDomain();
        }
      }
    })();
  });

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
            <Text>Set Priority Domain</Text>

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
                  if (!props.readOnly)
                    updatePriorityDomain(domaintemp);
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



function _ProgressView(props){
  function _progressCard(props){
    const theme = useContext(ThemeContext);
    var activity = props.activity;
    return (
      <View style = {styles._progressCard}>
        <View style = {{borderRadius: 50, width: 50, height: 50, backgroundColor: theme.theme[activity.domain]}} />
        <View style = {{marginLeft: 10}}>
          <Text style = {{fontSize : 13, color: '#9e9e9e'}}>{activity.date}</Text>
          <Text style = {{fontSize : 18}}>{activity.title}</Text>
        </View>
      </View>
    )
  }
  let progressViewProps = props.progressViewProps;
  // Filters logs for selected domain
  progressViewProps = progressViewProps.filter(function(item){
    return item.domain === props.domain
  });
  var ary = [];
  progressViewProps.map((activity, i) => ary.push(activity));
  ary = ary.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));
  ary = ary.reverse();
  // Sort the ary from the newest to oldest
  return (
    <View >
      {ary.map((activity, i) => <_progressCard key = {i} activity = {activity}/>)} 
    </View>
  )
  
}
export function _DomainProgressModal(props) {
  const [selectedDomain, setSelectedDomain] = useState('social');
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useContext(ThemeContext);
  function getButtonStyle(propDomain) {
    if (propDomain === selectedDomain) {
      return {
        height: 45,
        marginTop: 15,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginRight: 5,
        flex: 3,
        backgroundColor: theme.theme[propDomain],
      }
    } else {
      return {
        flex: 1,
        borderRadius: 45,
        height: 45,
        marginRight: 5,
        backgroundColor: theme.theme[propDomain]
      }
    }
  }

  function _touchableDomainButton(props) {
    var text = ""
    var isTrue = props.domain === selectedDomain;
    if (isTrue)
      text = props.domain;
    return (
      <TouchableOpacity style={getButtonStyle(props.domain)}
        onPress={() => setSelectedDomain(props.domain)}>
        <Text style={[isTrue ? styles.buttonText : {}]}>{text}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View>
      <Button
        type = "none"
        onPress={() => setModalVisible(true)}
        style={{ ...styles.card }}>
        <Text>Check Progress</Text>
      </Button>
      <Modal
        transparent={true}
        visible={modalVisible}
      >
        <View
          style={{
            height: 55,
            width: '90%',
            backgroundColor: 'white',
            marginTop: 20,
            marginLeft: 15,
            marginRight: 5,
            marginBottom: 0,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            padding: 0,
            flexDirection: "row",
          }}
        >
          <_touchableDomainButton domain="social" />
          <_touchableDomainButton domain="emotional" />
          <_touchableDomainButton domain="physical" />
          <_touchableDomainButton domain="mental" />
          <_touchableDomainButton domain="spiritual" />
        </View>
        <View
          style={{
            height: '86%',
            width: '90%',
            marginLeft: 15,
            marginRight: 15,
            marginTop: 0,
            padding: 12,
            backgroundColor: theme.theme[selectedDomain],
            borderBottomEndRadius: 15,
            borderBottomLeftRadius: 15,
            flexDirection: "column",
            alignItems: 'flex-end'
          }}>
          <ScrollView style={{ backgroundColor: 'white', margin: 0, padding: 12, width: '100%', height: '90%', borderRadius: 10 }}>
            <_ProgressView domain = {selectedDomain} progressViewProps = {props.progressViewProps}/>
          </ScrollView>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 15, marginRight: 2, borderRadius: 15, width: '30%', flex: 1, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 20, color: '#000000', fontWeight: 'bold' }}>Leave</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </View>
  )
}

type activityLogProp = {
  domain: string;
  title: string;
  date: string;
};

export function Settings() {
  const [progressViewProps, setProgressViewProps] = useState<activityLogProp[]>([]);
  const [surveys, setSurveys] = useState<SurveyModel[]>([]);
  
  // This variable is used to stop infinite re-rendering at useEffect()
  const idle = "";
  // Copied function from ../survey/CompletedSurveys.tsx 
  // Code inside of the useEffect should run only once per restart
  let s = [...surveys];

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
  },[idle]);

  useEffect(() => {
    (async () => {
      // This function is located near the root to minimize the number of query call
      // Copied and modified the fetchResults function from CompletedSurveys.tsx
      let tempProgressViewProps = progressViewProps;
      async function fetchResults() {
        const res = await getAllSurveyResults();
        if (res) {
          // Merge with surveys from local storage
          // Remove duplicates to fix hot reloading (surveys get added twice)
          s = [...s, ...res].filter(
            (a, i, self) => i === self.findIndex((b) => a._id === b._id),
          );
        }
        // Dates are any to make TypeScript happy about subtracting date objects.
        s.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));
  
        // Dates are reversed so that newer surveys show up on top
        return s.reverse();
      }

      // copied code from Calendar.tsx
      const loadActivities = async (): Promise<ActivityAgenda> => {
        let result = await getActivities();
        if (!result) {
          // No data yet
          result = {};
        }
    
        // Normalize dates
        Object.values(result).forEach((items) =>
          items.forEach((a) => (a.timestamp = new Date(a.timestamp))),
        );
    
        Object.keys(result).forEach((day) => {
          result[day] = result[day].filter((a) => !a.deleted);
        });

        return result;
      };
      let activityResult = await loadActivities();
      // store activities to activityLogProps
      Object.values(activityResult).forEach((items) => 
      items.forEach((a) => tempProgressViewProps.push({domain : a.domain, title : a.title, date : a.date})));

      let surveyResults = await fetchResults();
      surveyResults.map((s, i) => (
        // truncate the date to fit YYYY/MM/DD
        s.domains.forEach((d) => tempProgressViewProps.push({domain : d, title : "Completed survey", date : s.date.substring(0, 10)}))
      ));
      setProgressViewProps(tempProgressViewProps);
    })();
  }, []);
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
            <Text style={styles.subHeader}>Set your priority domain</Text>
            <_PriorityDomain
              readOnly={false}
            />



            <Text style={styles.subHeader}>Activities and surveys</Text>
            <_DomainProgressModal progressViewProps = {progressViewProps}/>


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
                Actions.replace('tutorialsurvey');
              }}
            >
              <Text>Tutorial</Text>
            </Button>
            <Text style={styles.subHeader}>Contact </Text>
            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Contact Crisis Line',
                  'If you are experiencing a mental health crisis, you can call a crisis line for support',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => Linking.openURL('tel: 1-800-784-2433'),
                    },
                  ],
                );
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>Call Crisis Line </Text>
            </Button>

            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Would you like to visit the BC Crisis Centre website?',
                  '',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => Linking.openURL('https://crisiscentre.bc.ca'),
                    },
                  ],
                );
              }}
            >
              <Text>BC Crisis Centre </Text>
            </Button>

            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Would you like to send an email to Dr. Dawson ?',
                  '',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => Linking.openURL('mailto:info@dawsonpsychologicalservices.com?subject=Contact: Health Circles App&body= '),
                    },
                  ],
                );
              }}
            >
              <Text>Email Dr. Dawson </Text>
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
  defaultButton: {
    borderRadius: 50,
    height: 50,
    width: 50,
    marginRight: 5,
  },
  selectedButton: {
    height: 50,
    width: 150,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },

  buttonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center'
  },

  _progressCard: {
    padding: 18,
    borderRadius: 14,
    margin: 12,
    marginTop: 0,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5.6,
    elevation: 5,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
  }
});
