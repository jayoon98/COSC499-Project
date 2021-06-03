import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [, setAuth] = useLocalStorage('auth', { email: null, authkey: null });
  const [, setPrefs] = useLocalStorage('prefs', {
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

  const getPrefs = (authkey) => {
    fetch('/api/getPrefs', {
      method: 'POST',
      body: JSON.stringify({
        authkey,
      }),
    }).then((response) => response.json())
      .then((response) => {
        // add prefs to context
        if (!response.error) {
          setPrefs({
            ...response,
            // Manually set these preferences since they need to be split for processing.
            avatar: response.avatar.split(','),
            circle_rank: response.circle_rank.split(''),
            circle_colors: response.circle_colors.split(','),
          });
          router.push('/');
        } else {
          setError('Unable to set preferences. Please login again.');
        }
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => response.json())
      .then((response) => {
        // add email/authkey to context
        if (!response.error && response.authkey !== null) {
          setAuth({
            email,
            authkey: response.authkey,
          });
          getPrefs(response.authkey);
        } else {
          setError('Invalid email or password');
        }
      });
  };

  let errorDiv = <></>;
  if (error !== '') {
    errorDiv = (
      <pre className="signup-error">
        {error}
      </pre>
    );
  }

  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Login</p>
        <form className="signup-form" onSubmit={submitHandler}>
          <div className="signup-form-container">
            <div className="signup-container">
              <label htmlFor="email" className="signup-label">
                Email Address
              </label>
              <label htmlFor="pass" className="signup-label">
                Password
              </label>
            </div>
            <div className="signup-container">
              <input type="text" name="email" onChange={(event) => setEmail(event.target.value)} />
              <input type="password" name="pass" onChange={(event) => setPassword(event.target.value)} />
            </div>
          </div>
          {errorDiv}
          <div style={{ textAlign: 'center' }}>
            <input type="submit" name="submit" value="Login" className="signup-submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
