import React from 'react';
import { Navigation, Header } from '../common/Core';
import { CompletedSurveys, CompletedSurveysProps } from './CompletedSurveys';
import { DomainSelection } from './DomainSelection';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';

/**
 * Page to begin a new survey and view previously completed surveys.
 * `lastSurveyId` is used to update the page once a new survey is completed.
 */
export function SurveyList({ lastSurveyId }: CompletedSurveysProps) {
  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Navigation selected="questionnaires">
        <View style={styles.container}>
          <Header title="Questionnaires" />
          <ScrollView>
            <DomainSelection />
            <CompletedSurveys lastSurveyId={lastSurveyId} />
          </ScrollView>
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
