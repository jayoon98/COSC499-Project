import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Title, ProgressBar, Button } from '../common/Core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Slider } from './Slider';
import { InfoModal } from './InfoModal';
import { Actions } from 'react-native-router-flux';
import {
  faTimes,
  faInfo,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../colors';
import {
  QuestionModel,
  submitResponse,
  getResponse,
  SurveyModel,
  submitSurvey,
} from '../services/survey';
import * as SVG from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../common/ThemeContext';

const minScore = 1;
const maxScore = 7;
const defaultScore = Math.round(maxScore / 2);

export type SurveyProps = {
  questions: QuestionModel[];
  survey: SurveyModel;
};

/**
 * The questionaire page. All survey questions should be passed in as
 * a prop, the parent is responsible for downloading the required questions
 * from the server. After each question is complete, the score is updated
 * with the server, and after the last question the survey is uploaded.
 *
 * If the survey has already been completed once, the saved values will
 * be used.
 */
export function Survey({ questions, survey }: SurveyProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(defaultScore);
  const [infoVisible, setInfoVisible] = useState(false);
  const question = questions[questionIndex];

  useEffect(() => {
    updateSlider(question);
  }, [questions]);

  // Sets the slider value to the stored value for this question
  // or the default value if this question has never been submitted
  const updateSlider = async (question: QuestionModel) => {
    const response = await getResponse(survey._id, question._id);
    if (response) {
      setSliderValue(response.response);
      return;
    }

    // Question has never been answered before
    setSliderValue(defaultScore);
  };

  const saveResponse = () => {
    submitResponse(
      survey._id,
      {
        questionId: question._id,
        response: sliderValue,
        domain: question.domains[0],
      },
      // For now log errors to the console
      (err) => err && console.error(err),
    );
  };

  const completeQuestion = async () => {
    if (questionIndex + 1 >= questions.length) {
      saveResponse();
      await submitSurvey(survey);
      Actions.replace('questionnaires', { lastSurveyId: survey._id });
      return;
    }
    saveResponse();
    updateSlider(questions[questionIndex + 1]);
    setQuestionIndex(questionIndex + 1);
  };

  const previousQuestion = () => {
    if (questionIndex - 1 < 0) {
      // For now we close the survey here until there's a button to do that
      Actions.pop();
      return;
    }
    saveResponse();
    updateSlider(questions[questionIndex - 1]);
    setQuestionIndex(questionIndex - 1);
  };

  // Header with domain name and survey progress
  const Header = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} color="white" />
            <Text style={{ color: 'white', marginLeft: 4 }}>back</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title color="white">{question.domains[0]}</Title>
          <Text style={{ color: 'white', fontSize: 18 }}>{`${
            questionIndex + 1
          } / ${questions.length}`}</Text>
        </View>
        <ThemeContext.Consumer>
          {(theme) => (
            <View style={styles.progress}>
              <ProgressBar
                progress={
                  // The +3 is just some extra width for the progress bar when it's
                  // at 0% so that it doesn't look strange
                  (questionIndex / questions.length) * 100 + 3
                }
                color="white"
                background={theme.theme[question.domains[0]]}
              />
            </View>
          )}
        </ThemeContext.Consumer>
      </View>
    );
  };

  const ImageIcon = () => {
    const icon = (() => {
      if (question.icon in SVG) {
        return SVG[question.icon];
      }
      console.warn(`survey: Missing icon '${question.icon}'`);
      return faTimes;
    })();

    return (
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={icon} size={96} color="#091038" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Lower bar with previous and next controls
  const ActionBar = () => (
    <View style={styles.actions}>
      <Button type="none" onPress={previousQuestion}>
        <Text>previous</Text>
      </Button>
      <Button type="none" onPress={completeQuestion}>
        <Text>next</Text>
      </Button>
    </View>
  );

  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="light-content" />
      <ThemeContext.Consumer>
        {(theme) => (
          <View
            style={{
              ...styles.container,
              backgroundColor: theme.theme[question.domains[0]],
            }}
          >
            <Header />
            <View style={styles.content}>
              <InfoModal
                description={question.description}
                visible={infoVisible}
                onClose={() => setInfoVisible(false)}
              />
              <ImageIcon />
              <Text style={{ fontSize: 28, padding: 24 }}>
                {question.title}
              </Text>
              <View style={styles.sliderContainer}>
                <Slider
                  colorLeft={theme.theme[question.domains[0]]}
                  min={minScore}
                  max={maxScore}
                  value={sliderValue}
                  onChangeValue={setSliderValue}
                />
              </View>
              <View style={styles.infoContainer}>
                <Button
                  innerStyle={styles.info}
                  onPress={() => setInfoVisible(true)}
                >
                  <FontAwesomeIcon icon={faInfo} />
                </Button>
              </View>
              <ActionBar />
            </View>
          </View>
        )}
      </ThemeContext.Consumer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    padding: 24,
    backgroundColor: 'white',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.lightgrey,
  },
  infoContainer: {
    display: 'flex',
    paddingTop: 32,
    paddingBottom: 32,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  info: {
    backgroundColor: Colors.lightgrey,
    borderRadius: 50,
  },
  sliderContainer: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    display: 'flex',
  },
  header: {
    padding: 16,
    width: '100%',
    justifyContent: 'flex-end',
    height: '25%',
  },
  progress: {
    marginTop: 18,
    marginBottom: 8,
  },
  iconContainer: {
    marginTop: 28,
    backgroundColor: Colors.lightgrey,
    padding: 32,
    borderRadius: 200,
    marginBottom: 12,
  },
});
