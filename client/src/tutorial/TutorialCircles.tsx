import React from 'react';
import { Title, Navigation, Header } from '../common/Core';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { CirclesVisual } from '../circles/CirclesVisual';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import { Actions } from 'react-native-router-flux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export function TutorialCircles() {
  const iconProps = { size: 40, color: '#888' };
  const {
    canStart = true, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

  React.useEffect(() => {
    if (canStart) {
      start(5);
    }
  }, [canStart]);

  const handleOnStart = () => null;
  const handleOnStop = () => Actions.replace('tutorialcalendar');
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

  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <TourGuideZone
          zone={5}
          keepTooltipPosition
          isTourGuide
          text={
            'This is the Health Circles page, where you can see the results of the health questionnaires you have answered.'
          }
        >
          <Header title="My HealthCircles" />
        </TourGuideZone>
        <TourGuideZone
          zone={7}
          keepTooltipPosition
          text={
            'Once you complete a survey, a circle of size relative to your score in the domain will appear here.'
          }
          style={{ top: 0, height: '50%' }}
        >
          <TouchableWithoutFeedback onPress={() => start(5)}>
            <View>
              <CirclesVisual />
            </View>
          </TouchableWithoutFeedback>
        </TourGuideZone>
      </View>
      <TourGuideZone
        zone={6}
        //keepTooltipPosition
        tooltipBottomOffset={100}
        text={
          'This is where you can access information, strategies and suggested activities for each domain!'
        }
        style={{ alignItems: 'flex-end', height: 300, bottom: 600 }}
      />
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
