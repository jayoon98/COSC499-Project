import React, { useState, useContext, useEffect } from 'react';
import { Navigation, Header, Button } from '../common/Core';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { ThemeContext } from '../common/ThemeContext';
import { customLocalDate, customLocalTime } from '../services/customLocalDate';
import {
  Activity,
  ActivityAgenda,
  getActivities,
  updateActivities,
} from '../services/activities';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

/* known issues/TODO
cannot scroll up past selected date
format of activities needs beautification
height of date in list needs to be adjusted based on # of activities in day (maybe?)
*/

const screen = Dimensions.get('screen');

let today = new Date();
const startOfCal = new Date(today.getFullYear(), today.getMonth() - 3, 1);
const endOfCal = new Date(today.getFullYear(), today.getMonth() + 12, 1);
endOfCal.setDate(endOfCal.getDate() + 30);
const daysUsed = [];
for (let d = startOfCal; d <= endOfCal; d.setDate(d.getDate() + 1)) {
  daysUsed.push(customLocalDate(d));
}

console.log(customLocalTime(new Date(0)));

const accentColor = '#000000';

export type ActivitiesCalendarProps = {
  // If present, open the `AddEditActivity` page and use this activity
  // as the default value.
  activity?: Activity;
};

/**
 * Calendar page. User can create new activities, edit existing activities
 * with a short tap, delete activities with a long press and check off
 * completed activities.
 *
 * @param props - If an activity is passed as a props, the calendar will
 * go the the `AddEditActivity` page with the values given.
 */
export function ActivitiesCalendar(props: ActivitiesCalendarProps) {
  const [activities, setActivities] = useState<ActivityAgenda>({});
  const { theme } = useContext(ThemeContext);

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

    daysUsed.forEach((date) => {
      if (!(date in result)) {
        result[date] = [];
      }
    });
    return result;
  };

  useEffect(() => {
    if (props.activity && !props.activity.deleted) {
      const activity = { ...props.activity };
      Actions.push('addeditactivity', {
        activity: activity,
        onCreate: updateActivity,
      });
      props.activity.deleted = true;
      return;
    }

    (async () => {
      const result = await loadActivities();
      setActivities(result);
    })();
  }, [setActivities]);

  const updateActivity = (activity: Activity) => {
    (async () => {
      let result = { ...activities };

      // When coming from the circles page, we don't fully load the calendar,
      // instead we open the edit page directly. When this happens we need
      // to load all other activities before trying to add a new one.
      if (Object.keys(activities).length === 0) {
        result = await loadActivities();
      }

      if (!(activity.date in result)) {
        result[activity.date] = [];
      }

      let items = result[activity.date];
      items = items.filter((a) => a._id !== activity._id);
      
      items.push(activity);
      updateActivities(activity.date, items);
      items = items.filter((a) => a.deleted !== true);

      items.sort((a, b) => a.timestamp.getUTCDate() - b.timestamp.getUTCDate());
      console.log(items);

      result[activity.date] = items;
    

      // There are better ways to do this, but we need to set activities to an empty
      // object in order for the agenda to refresh. sigh.
      setActivities({});
      setTimeout(() => setActivities(result), 16);
    })();
  };

  const makeMarkedDates = () => {
    const dates: { [date: string]: any } = {};
    Object.values(activities).forEach((items) =>
      items.forEach((activity) => {
        dates[activity.date] = {
          selected: true,
          marked: true,
          selectedColor: theme[activity.domain],
        };
      }),
    );
    return dates;
  };

  const renderItems = (activity: Activity) => {
    return (
      <View style={[styles.item, { borderColor: theme[activity.domain] }]}>
        <TouchableWithoutFeedback
          onPress={() =>
            updateActivity({ ...activity, complete: !activity.complete })
          }
        >
          <FontAwesomeIcon
            icon={activity.complete ? faDotCircle : faCircle}
            size={28}
            style={{
              color: theme[activity.domain],
              marginLeft: 6,
              marginRight: 12,
            }}
          />
        </TouchableWithoutFeedback>
        <TouchableOpacity
          style={{ width: 500 }}
          onPress={() =>
            Actions.push('addeditactivity', {
              activity,
              onCreate: updateActivity,
            })
          }
          onLongPress={() => {
            Alert.alert(
              'Delete',
              `Are you sure you want to delete "${activity.title}"?`,
              [
                {
                  text: 'No',
                  onPress: () => {},
                },
                {
                  text: 'Yes',
                  onPress: () => updateActivity({ ...activity, deleted: true }),
                },
              ],
            );
          }}
        >
          <Text>{activity.title}</Text>
          <Text>{activity.description}</Text>
          <Text>{activity.time}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Navigation>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <Header title="Calendar">
          <Button
            style={{ marginRight: 12, marginLeft: 'auto' }}
            type="none"
            onPress={() =>
              Actions.push('addeditactivity', {
                activity: null,
                onCreate: updateActivity,
              })
            }
          >
            <FontAwesomeIcon icon={faPlus} color="cornflowerblue" size={28} />
          </Button>
        </Header>
        <View style={{ height: '100%' }}>
          <Agenda
            items={activities}
            markedDates={makeMarkedDates()}
            renderItem={renderItems}
            renderEmpyDate={() => {
              return <View style={styles.emptyDate} />;
            }}
            pastScrollRange={12}
            futureScrollRange={12}
            theme={{
              arrowColor: accentColor,
              todayTextColor: accentColor,
            }}
            rowHasChanged={(r1, r2) => {
              return r1.text !== r2.text;
            }}
          />
        </View>
      </View>
    </Navigation>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 70,
    borderLeftWidth: 7,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6.6,
    elevation: 5,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  modalView: {
    height: '80%',
    width: '100%',
    display: 'flex',
    //justifyContent: 'space-between',
    //margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    //minHeight: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formText: {
    fontSize: screen.height * 0.025,
  },
});
