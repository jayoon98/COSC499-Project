import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Welcome from '../components/Welcome';
import Survey from '../components/Survey';
import useLocalStorage from '../functions/useLocalStorage';

function LandingPage() {
  const [submitMessage, setSubmitMessage] = useState(<></>);

  const [auth] = useLocalStorage('auth', { email: null, authkey: null });
  const [, setSurvey] = useLocalStorage('survey', []);

  const router = useRouter();

  function submit(answers) {
    if (auth.email != null && auth.authkey != null) {
      fetch('/api/submitAnswers', {
        method: 'POST',
        body: JSON.stringify({
          answers,
          authkey: auth.authkey,
        }),
      }).then((response) => response.json())
        .then((response) => {
          if (!response.error) {
            setSubmitMessage(
              <p className="success-text">
                Thank you for taking the questionnaire!
              </p>,
            );
            router.push('/submitted');
          } else {
            setSubmitMessage(
              <p className="success-text">
                Oops! There was an error submitting your answers. Please try submitting them again.
              </p>,
            );
          }
        });
    } else {
      setSurvey(answers);
      router.push('/saved');
    }
  }

  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <Welcome />
        <div style={{ textAlign: 'center' }}>
          <p className="survey-text">
            After taking this survey, your answers will be used to calculate how
            well you&apos;re doing in each of the five domains, listed above.
            If you score low in a domain, suggestions and activities will be
            provided to help you improve in that domain. Your answers will remain
            private, unless you&apos;re a client of Dr. Kim Dawson, and then only
            he and his associates will be able to view your information.
          </p>
        </div>
        <Survey props={{ submit: (a) => submit(a), submitMessage, admin: false }} />
      </div>
    </div>
  );
}

export default LandingPage;
