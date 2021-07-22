import React, { useState } from 'react';
import { Header, Button } from '../common/Core';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { _PriorityDomain } from '../settings/Settings';
import { customLocalDate, customLocalTime } from '../services/customLocalDate';
import { Activity } from '../services/activities';

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

  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Header title={props.activity ? 'Edit Activity' : 'Select a Health Circle and Enter a Health Activity in Your Calendar'} />

      <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24 }}>
        <_PriorityDomain
          domain={activity.domain}
          onChange={(domain) => setActivity({ ...activity, domain })}
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
          <View style={{ paddingTop: 16 }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(activity.date)}
              display="default"
              onChange={(_, timestamp) =>
                setActivity({
                  ...activity,
                  timestamp,
                  date: customLocalDate(timestamp),
                  time: customLocalTime(timestamp),
                })
              }
              mode={'datetime'}
            />
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
            props.onCreate(activity);
            Actions.pop();
          }}
        >
          <Text style={{ color: 'white' }}>
            {props.activity ? 'Confirm' : 'Create'}
          </Text>
        </Button>
      </View>
    </View>
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
    marginTop: 24,
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

  button: {
    display: 'flex',
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
});
