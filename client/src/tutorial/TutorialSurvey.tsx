import React from 'react';
import { Navigation, Header } from '../common/Core';
import {
  CompletedSurveys,
  CompletedSurveysProps,
} from '../survey/CompletedSurveys';
import { DomainSelection } from '../survey/DomainSelection';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import { Actions } from 'react-native-router-flux';

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

  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <Navigation>
        <View style={styles.container}>
          <TourGuideZone
            zone={1}
            isTourGuide
            text={
              'This is the Questionnaires page, where you will answer surveys about your health'
            }
          >
            <Header title="Questionnaires" />
          </TourGuideZone>

          <ScrollView>
            <TourGuideZone
              zone={3}
              text={
                'This is where you can select which health domains you would like to answer questions for. You press each button to highlight the domain, then hit the begin button to start.'
              }
              borderRadius={16}
            >
              <DomainSelection />
            </TourGuideZone>
            <TourGuideZone
              zone={4}
              text={
                'After you complete a survey, a list will start here showing you when you completed surveys, and in which health domain they were completed. '
              }
              borderRadius={16}
            >
              <CompletedSurveys />
            </TourGuideZone>
          </ScrollView>
        
        <TourGuideZone
          zone={2}
          text={
            'This is the navigation bar, where you can move around different areas of the app.'
          }
          style={{ alignItems: 'flex-end', height: 200, bottom: 200 }}
        />
        </View>
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
