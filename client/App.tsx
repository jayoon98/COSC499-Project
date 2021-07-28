import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Survey } from './src/survey/Survey';
import { SurveyList } from './src/survey/SurveyList';
import { Report } from './src/survey/Report';
import { ReportDetails } from './src/survey/ReportDetails';
import { Router, Stack, Scene } from 'react-native-router-flux';
import { CirclesHome } from './src/circles/CirclesHome';
import { Settings } from './src/settings/Settings';
import { Themes } from './src/settings/Themes';
import { ActivitiesCalendar } from './src/calendar/Calendar';
import { Login, Signup, ResetPassword } from './src/login/Login';
import { ToS } from './src/tutorial/ToS';
import { TutorialSurvey } from './src/tutorial/TutorialSurvey';
import { TutorialCircles } from './src/tutorial/TutorialCircles';
import { AuthHandler } from './src/login/Auth';
import { AddEditActivity } from './src/calendar/AddEditActivity';


import firebase from 'firebase';

import { LogBox } from 'react-native';
import { ThemeContext, themes } from './src/common/ThemeContext';
import { getUserTheme } from './src/services/theme';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import { TutorialCalendar } from './src/tutorial/TutorialCalendar';
LogBox.ignoreAllLogs();

//const value = useContext(ThemeContext);

const firebaseConfig = {
  apiKey: 'AIzaSyDSADkWwtdp8yOB9F8Xv5Bv5Fa8jz9RM6o',
  authDomain: 'healthcircles-f25de.firebaseapp.com',
  projectId: 'healthcircles-f25de',
  storageBucket: 'healthcircles-f25de.appspot.com',
  messagingSenderId: '292440636096',
  appId: '1:292440636096:web:42a7cb0adca72365dc0b25',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

//import { LogBox } from 'react-native';
//LogBox.ignoreAllLogs();

export default function App() {
  // Theme is stored all the way at the top so everyone updates
  const [theme, setTheme] = useState(themes.theme1);

  useEffect(() => {
    (async () => {
      const selectedTheme = await getUserTheme();
      if (selectedTheme) {
        setTheme(themes[selectedTheme]);
      }
    })();
  }, [setTheme]);

  return (
    <TourGuideProvider androidStatusBarVisible={true} {...{ borderRadius: 16 }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Router>
          <Stack key="root">
            <Scene key="auth" component={AuthHandler} hideNavBar />

            {/* Main Routes */}
            <Scene key="questionnaires" component={SurveyList} hideNavBar />
            <Scene key="circles" component={CirclesHome} hideNavBar />
            <Scene key="calendar" component={ActivitiesCalendar} hideNavBar />
            <Scene key="settings" component={Settings} hideNavBar />
            <Scene key="report" component={Report} hideNavBar />
            <Scene key="reportdetails" component={ReportDetails} hideNavBar />
            {/* Tutorial */}
            <Scene key="tos" component={ToS} hideNavBar />
            <Scene key="tutorialsurvey" component={TutorialSurvey} hideNavBar />
            <Scene
              key="tutorialcircles"
              component={TutorialCircles}
              hideNavBar
            />
            <Scene
              key="tutorialcalendar"
              component={TutorialCalendar}
              hideNavBar
            />

            {/* Other screens */}
            <Scene key="survey" component={Survey} hideNavBar />
            <Scene key="themes" component={Themes} hideNavBar />
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="signup" component={Signup} hideNavBar />
            <Scene
              key="addeditactivity"
              component={AddEditActivity}
              hideNavBar
            />
            <Scene key="resetpassword" component={ResetPassword} hideNavBar />

          </Stack>
        </Router>
      </ThemeContext.Provider>
    </TourGuideProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
