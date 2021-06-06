import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Survey from '../../components/Survey';
import UserTable from '../../components/UserTable';
import useLocalStorage from '../../functions/useLocalStorage';

/*
  NOTE: this page will not be able to load data from the API until the cursor error is fixed.
  The cursor error prevents 2 or more API calls from being made at once, which this page does
  to populate the survey questions and the users table.
*/

export default function adminPage() {
  const [auth] = useLocalStorage('auth', { email: null, authkey: null });
  const [prefs] = useLocalStorage('prefs', {
    first_name: null,
    last_name: null,
    date_created: null,
    last_login: null,
    isClient: null,
    isAdmin: null,
    circle_colors: null,
    circle_rank: null,
    notify_time: null,
    avatar: null,
  });
  const router = useRouter();

  const [submitMessage, setSubmitMessage] = useState(<></>);

  useEffect(() => {
    if (!prefs.isAdmin) router.push('/');
  }, [prefs.isAdmin]);

  async function updateQuestions(questions) {
    const edited = [];
    const added = [];

    setSubmitMessage(
      <p className="success-text">
        Survey changes saved!
      </p>,
    );

    questions.forEach((x) => {
      if (x.new) added.push(x);
      else if (x.edit) edited.push(x);
    });

    await Promise.all(edited.map(async (q) => {
      await fetch('/api/editQuestion', {
        method: 'POST',
        body: JSON.stringify({
          authkey: auth.authkey,
          question: q,
        }),
      });
    }));

    if (added.length > 0) {
      await fetch('/api/addQuestion', {
        method: 'POST',
        body: JSON.stringify({
          authkey: auth.authkey,
          questions: added,
        }),
      });
    }

    window.location.reload();
  }

  return (
    <div>
      <Head>
        <title>VHC - Virtual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page admin-page">
        <p className="page-title">Admin Panel</p>
        <UserTable props={{ authkey: auth.authkey }} />
        <Survey props={{ submit: updateQuestions, submitMessage, admin: true }} />
      </div>
    </div>
  );
}
