import React, { useState } from 'react';
import { Header, Button } from '../common/Core';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  StatusBar,
  Platform,
  Modal,
  Alert,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { _PriorityDomain } from '../settings/Settings';
import { customLocalDate, customLocalTime } from '../services/customLocalDate';
import { Activity } from '../services/activities';
import { Notifications } from 'expo';



export type AddEditActivityProps = {
  activity?: Activity;
  // Callback for when an activity is updated
  onCreate: (activity: Activity) => void;
};

/**
 * @param props - If activity is not null, edit the activity instead of creating
 * a new one.
 */
export function AddEditActivity(props: AddEditActivityProps) {
  const emptyActivity: Activity = {
    _id: null,
    timestamp: new Date(),
    date: customLocalDate(new Date()),
    time: customLocalTime(new Date()),
    domain: 'social',
    description: '',
    title: '',
    complete: false,
  };

  const [activity, setActivity] = useState(props.activity ?? emptyActivity);

  const [date, setDate] = useState(new Date(activity.date));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);



  const onChange = (_, timestamp) => {
    const currentDate = timestamp || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setActivity({
      ...activity,
      timestamp,
      date: customLocalDate(timestamp),
      time: customLocalTime(timestamp),
    })
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const localNotification = {
    title: activity.title,
    body: activity.description, // (string) — body text of the notification.
    ios: { // (optional) (object) — notification configuration specific to iOS.
      sound: true // (optional) (boolean) — if true, play a sound. Default: false.
    },
    android: // (optional) (object) — notification configuration specific to Android.
    {
      sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
      //icon (optional) (string) — URL of icon to display in notification drawer.
      //color (optional) (string) — color of the notification icon in notification drawer.
      priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
      sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
      vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
      // link (optional) (string) — external link to open when notification is selected.
    }
  };

  let t = new Date(activity.date);

  t.setSeconds(t.getSeconds() - 3600);

  const schedulingOptions = {
    time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.

  };

  const [modalVisible, setModalVisible] = useState(false);
  return (
   <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
      style={{ flex: 1 }}>
    <View>
    
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Header title={props.activity ? 'Edit Activity' : 'New Activity'} />

      <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24 }}>
        <_PriorityDomain
          domain={activity.domain}
          onChange={(domain) => setActivity({ ...activity, domain })}
          readOnly = {true}
        />
      </View>

      <TouchableWithoutFeedback
        style={{ zIndex: -1 }}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.container}>
          <Text style={styles.subHeader}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="activity title"
            onChangeText={(title) => setActivity({ ...activity, title })}
            value={activity.title}
          />

          <Text style={styles.subHeader}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="activity description"
            onChangeText={(description) =>
              setActivity({ ...activity, description })
            }
            value={activity.description}
          />

          <Text style={styles.subHeader}>Date</Text>
          <View style={styles.pickers}>
            <View style={styles.buttonContainer}>
              <Button onPress={showDatepicker} >
                <Text>{activity.date}</Text>
              </Button>
            </View>
            <View style={styles.buttonContainer} >
              <Button onPress={showTimepicker}  >
                <Text>{activity.time}</Text>

              </Button>
            </View>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Activity not saved.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Activity added </Text>
                  <Text style={styles.modalText}>Reminder set at {activity.date}  {activity.timestamp.getHours()-1}:{activity.timestamp.getMinutes()}</Text>
                  

                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={() => {
                      setModalVisible(!modalVisible);

                      // add notification trigger? 
                      Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
                      props.onCreate(activity);
                      Actions.pop();
                    }}>
                    <Text style={styles.textStyle}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>


        </View>
      </TouchableWithoutFeedback>
      <View style={styles.actions}>
        <Button
          type="secondary"
          style={{ ...styles.button, marginRight: 4 }}
          onPress={() => Actions.pop()}
        >
          <Text>Cancel</Text>
        </Button>
        <Button
          type="primary"
          style={{ ...styles.button, marginLeft: 4 }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={{ color: 'white' }}>
            {props.activity ? 'Confirm' : 'Create'}
          </Text>
        </Button>
      </View>
    </View>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },

  subHeader: {
    marginTop: 20,
  },

  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#d1d4d6',
    borderRadius: 4,
    width: '100%',
    padding: 12,
  },

  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    padding: 16,
  },

  pickers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 8,
  },

  button: {
    display: 'flex',
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
});
