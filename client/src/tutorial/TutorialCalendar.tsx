import React, { useState, useContext, useEffect } from 'react';
import { Navigation, Header, Button } from '../common/Core';
import { View, StyleSheet, Text, Dimensions, StatusBar } from 'react-native';
import { Agenda } from 'react-native-calendars';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { ThemeContext } from '../common/ThemeContext';
import { customLocalDate } from '../services/customLocalDate';
import {
  Activity,
  ActivityAgenda,
  getActivities,
  updateActivities,
} from '../services/activities';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';

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

const accentColor = '#000000';

export function TutorialCalendar() {
  const iconProps = { size: 40, color: '#888' };
  const {
    canStart = true, // a boolean indicate if you can start tour guide
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
  const handleOnStop = () => Actions.replace('questionnaires');
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

  const [activities, setActivities] = useState<ActivityAgenda>({});
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      let result = await getActivities();
      if (!result) {
        // No data yet
        result = {};
      }

      // Normalize dates
      Object.values(result).forEach((items) =>
        items.forEach((a) => (a.timestamp = new Date(a.timestamp))),
      );

      daysUsed.forEach((date) => {
        if (!(date in result)) {
          result[date] = [];
        }
      });
      setActivities(result);
    })();
  }, [setActivities]);

  const updateActivity = (activity: Activity) => {
    const result = { ...activities };
    if (!(activity.date in result)) {
      result[activity.date] = [];
    }

    let items = result[activity.date];
    // TODO: use id
    items = items.filter((a) => a.title !== activity.title);
    items.push(activity);
    items.sort((a, b) => a.timestamp.getUTCDate() - b.timestamp.getUTCDate());

    result[activity.date] = items;
    setActivities(result);
    updateActivities(activity.date, items);
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
    start(9);
    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: theme[activity.domain] }]}
        onPress={() => start(9)}
      >
        <Text>{activity.title}</Text>
        <Text>{activity.description}</Text>
        <Text>{activity.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => start(9)}>
      <View style={styles.container}>
        <TourGuideZone
          zone={9}
          keepTooltipPosition
          isTourGuide
          text={
            'This is the Calendar page. The "+" button on the right will let you add an activity to the calendar.'
          }
        >
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
        </TourGuideZone>
        <TourGuideZone
          zone={10}
          keepTooltipPosition
          text={
            'This is the calendar. You can press on a date to bring down the full calendar. As you add activities, the list below will populate with the items you add. Thanks for completing the tutorial.'
          }
          style={{ top: 50 }}
        >
          <View style={{ height: '100%' }}>
            <Agenda
              items={activities}
              markedDates={makeMarkedDates()}
              renderItem={renderItems}
              renderEmpyDate={() => {
                start(9);
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
        </TourGuideZone>
      </View>
    </TouchableWithoutFeedback>
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
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 70,
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
