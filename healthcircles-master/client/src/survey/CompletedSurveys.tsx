import React, { useState, useEffect, useContext } from 'react';
import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../common/Core';
import { View, Text, StyleSheet } from 'react-native';
import {
  SurveyModel,
  getAllSurveyResults,
  getSurveyQuestions,
} from '../services/survey';
import { ThemeContext } from '../common/ThemeContext';
import { Colors } from '../colors';
// TODO @Temporary
const domains = ['social', 'emotional', 'physical', 'mental', 'spiritual'];

export type CompletedSurveysProps = {
  lastSurveyId?: string;
};

type CompletedCardProps = {
  survey: SurveyModel;
  onEdit: (survey: SurveyModel) => void;
};

function CompletedCard({ survey, onEdit }: CompletedCardProps) {
  const theme = useContext(ThemeContext);
  const makeDots = () => {
    // If the survey includes questions with this domain the dot has the
    // domain color
    return domains.map((d, i) => {
      const style =
        survey.domains.indexOf(d) === -1
          ? styles.domainCircle
          : { ...styles.domainCircle, backgroundColor: theme.theme[d] };
      return <View key={i} style={style} />;
    });
  };

  return (
    <View style={styles.completedSurveyCard}>
      <Button
        onPress={() => onEdit(survey)}
        type="none"
        innerStyle={styles.editButton}
      >
        <FontAwesomeIcon icon={faPen} size={16} color={Colors.lightgrey} />
      </Button>
      <Text>
        {new Date(survey.date).toLocaleDateString('en-ca', {
          month: 'long',
          day: 'numeric',
        })}
      </Text>
      <View
        style={{ display: 'flex', flexDirection: 'row-reverse', flexGrow: 1 }}
      >
        {makeDots()}
      </View>
    </View>
  );
}

/**
 * A list of surveys that have been completed. An optional `lastSurveyId` is
 * used to update the list once a new survey is completed.
 */
export function CompletedSurveys({ lastSurveyId }: CompletedSurveysProps) {
  const [surveys, setSurveys] = useState<SurveyModel[]>([]);

  // For now we sort when the component is initialized
  // TODO: This list doesn't update until the app is restarted
  useEffect(() => {
    // Copy surveys so that we don't modify the state in place when sorting
    let s = [...surveys];

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
      setSurveys(s.reverse());
    }
    fetchResults();
  }, [setSurveys, lastSurveyId]);

  const editSurvey = async (survey: SurveyModel) => {
    if (survey.domains.length === 0) {
      return;
    }
    const questions = await getSurveyQuestions(survey.domains);
    Actions.push('survey', { questions, survey });
  };

  return (
    <View style={styles.completedSurvey}>
      <View style={styles.completedSurveyHeader}>
        <Text>Completed Surveys</Text>
      </View>
      {surveys.map((s, i) => (
        <CompletedCard key={i} survey={s} onEdit={editSurvey} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  completedSurvey: {
    width: '100%',
    display: 'flex',
  },
  completedSurveyHeader: {
    margin: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.offwhite,
    display: 'flex',
    alignItems: 'center',
  },
  completedSurveyCard: {
    padding: 18,
    borderRadius: 14,
    margin: 12,
    marginTop: 0,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5.6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainCircle: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: Colors.offwhite,
    marginLeft: 12,
  },
  editButton: {
    padding: 0,
    marginRight: 12,
    backgroundColor: '#525868',
    height: 32,
    width: 32,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
