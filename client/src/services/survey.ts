import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import { ErrorCallback, ResponseCallback } from './types';

export type SurveyModel = {
  _id: string;
  date: string;
  domains: string[];
  progress: number;
  completed: boolean;

  // Ids for all the questions in the survey, this way the survey can be
  // reconstructed with the same questions as when it was submitted.
  questions: string[];
};

export type QuestionModel = {
  _id: string;
  title: string;
  icon: string;
  // A question can belong to more than one domain
  domains: string[];
  inputType: string;
  description: string;
};

export type QuestionResponse = {
  questionId: string;

  // Number from 1 to 7
  response: number;
  domain: string;
};

export type DomainAverages = {
  social: number;
  emotional: number;
  physical: number;
  mental: number;
  spiritual: number;
};

/**
 * Returns survey questions from the server.
 * @param domains - The domains to filter questions with
 */
export async function getSurveyQuestions(
  domains: string[],
): Promise<QuestionModel[]> {
  const result: QuestionModel[] = [];
  // TODO: @Cleanup the schema changed but internally we're still using
  // the old question model so this will need to be converted
  for (const domain of domains) {
    const data = await await (
      await firebase.database().ref(`questions/${domain}`).get()
    ).val();

    Object.entries(data).forEach(([id, question]: any) => {
      result.push({
        _id: id,
        title: question.title,
        icon: question.icon,
        description: question.description,
        domains: [domain],
        inputType: '',
      });
    });
  }
  return result;
}

/**
 * Saves the survey to local storage.
 * @param survey - The survey to add
 */
export async function submitSurvey(survey: SurveyModel) {
  const user = firebase.auth().currentUser.uid;
  const surveyUpdate = { completed: true, date: new Date().toISOString() };
  const surveyRef = firebase
    .database()
    .ref(`users/${user}/surveys/${survey._id}`);
  return surveyRef.update(surveyUpdate);
}

/**
 * Returns an array of all surveys saved in local storage.
 * @param completed - Returns only completed surveys when set to true,
 * returns all surveys when false.
 */
export async function getAllSurveyResults(
  filterCompleted = true,
): Promise<SurveyModel[]> {
  const result: SurveyModel[] = [];
  const user = firebase.auth().currentUser.uid;
  const surveys = await await (
    await firebase.database().ref(`users/${user}/surveys`).get()
  ).val();

  if (!surveys) {
    return result;
  }

  Object.entries(surveys).forEach(([id, survey]: any) => {
    if (!filterCompleted || survey.completed) {
      result.push({
        _id: id,
        date: survey.date,
        domains: survey.domains,
        progress: survey.progress,
        completed: survey.completed,
        questions: [],
      });
    }
  });

  return result;
}

/**
 * Saves the user reponse for a survey question to local storage.
 * @param surveyId - Unique identifier for the survey
 * @param reponse - The user response
 * @param callback - Called when the request is resolved
 */
export function submitResponse(
  surveyId: string,
  response: QuestionResponse,
  callback: ErrorCallback,
) {
  const user = firebase.auth().currentUser.uid;
  const surveys = firebase
    .database()
    .ref(`users/${user}/surveys/${surveyId}/questions/${response.questionId}`);

  surveys
    .set({ response: response.response, domain: response.domain })
    .catch(callback);
}

/**
 * Returns the average score for each domain for the last :n: surveys
 *
 * @param numberOfRecentSurveys - How many surveys to average
 */
export async function getDomainScoreAverages(
  numberOfRecentSurveys: number,
): Promise<DomainAverages> {
  const user = firebase.auth().currentUser.uid;
  const surveys = await await (
    await firebase.database().ref(`users/${user}/surveys`).get()
  ).val();

  const averages: DomainAverages = {
    emotional: 0,
    mental: 0,
    physical: 0,
    social: 0,
    spiritual: 0,
  };
  const counts = { ...averages };

  if (!surveys) {
    return null;
  }
  let completedSurveys = 0;

  Object.entries(surveys)
    .reverse()
    .forEach(([_, survey]: any) => {
      if (!survey.questions || !survey.completed) {
        return;
      }
      if (completedSurveys >= numberOfRecentSurveys) {
        return;
      }

      Object.entries(survey.questions).forEach(([_, question]: any) => {
        if (!question.domain) {
          // TODO: Need to see why some questions don't have domains...
          // Will investigate.
          return;
        }
        averages[question.domain] += question.response;
        counts[question.domain]++;
      });
      completedSurveys++;
    });

  for (const key in averages) {
    averages[key] /= Math.max(counts[key], 1);
  }
  return averages;
}

/**
 * Saves the user reponse for a survey question to local storage.
 * @param surveyId - Unique identifier for the survey
 * @param questionId - Unique identified for the question
 */
export async function getResponse(
  surveyId: string,
  questionId: string,
): Promise<QuestionResponse | null> {
  const user = firebase.auth().currentUser.uid;
  const questionResult = await firebase
    .database()
    .ref(`users/${user}/surveys/${surveyId}/questions/${questionId}`)
    .get();
  return questionResult.val();
}

/**
 * Create a new survey from an array of question ids
 */
export async function createSurvey(domains: string[]): Promise<SurveyModel> {
  // Create new empty survey which will hold results from user
  const emptySurvey = {
    completed: false,
    domains,
    progress: 0,
    date: new Date().toISOString(),
    questions: [],
  };
  const user = firebase.auth().currentUser.uid;
  const survey = await firebase
    .database()
    .ref(`users/${user}/surveys`)
    .push(emptySurvey);

  return { _id: survey.key, ...emptySurvey };
}

/**
 * Delete all survey data for logged in user
 */
export async function deleteSurveyData() {
  const user = firebase.auth().currentUser.uid;
  return firebase.database().ref(`users/${user}/surveys`).remove();
}
