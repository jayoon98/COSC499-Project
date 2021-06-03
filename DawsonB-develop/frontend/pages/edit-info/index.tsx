import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import 'react-image-picker/dist/index.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';

export default function editInfoPage() {
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [client, setClient] = useState(false);
  const [clientStatus, setClientStatus] = useState(false);
  const [error, setError] = useState('');
  const [auth, setAuth] = useLocalStorage('auth', { email: null, authkey: null });
  const [accountInfo, setAccountInfo] = useLocalStorage('prefs', {
    email: null,
    password: null,
    first_name: null,
    last_name: null,
    last_login: null,
    date_created: null,
    isClient: null,
    isAdmin: null,
    circle_colors: null,
    circle_rank: null,
    notify_time: null,
    avatar: null,
  });

  const router = useRouter();

  const validate = () => {
    let errorText = '';

    if (firstName.length === 0) {
      errorText += 'Enter your first name\n';
    }

    if (lastName.length === 0) {
      errorText += 'Enter your last name\n';
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      errorText += 'Enter a valid email address\n';
    }

    if (email !== emailConfirm) {
      errorText += 'Entered emails do not match.\n';
    }

    setError(errorText);
    return errorText === '';
  };

  function loadAccount() {
    setfirstName(accountInfo.first_name);
    setlastName(accountInfo.last_name);
    setEmail(accountInfo.email);
    setEmailConfirm(accountInfo.email);
    setClient(accountInfo.isClient === 1);
    setClientStatus(accountInfo.isClient === 1);
  }
  useEffect(() => loadAccount(), []);

  const submitHandler = (event) => {
    event.preventDefault();

    if (!validate()) return;

    fetch('/api/editInfo', {
      method: 'POST',
      body: JSON.stringify({
        authkey: auth.authkey,
        firstName,
        lastName,
        email,
        client,
      }),
    }).then((response) => response.json());
    setAuth({
      email,
      authkey: auth.authkey,
    });

    setAccountInfo({
      email,
      password: accountInfo.password,
      first_name: firstName,
      last_name: lastName,
      last_login: accountInfo.last_login,
      date_created: accountInfo.date_created,
      isClient: client ? 1 : 0,
      isAdmin: accountInfo.isAdmin,
      circle_colors: accountInfo.circle_colors,
      circle_rank: accountInfo.circle_rank,
      notify_time: accountInfo.notify_time,
      avatar: accountInfo.avatar,
    });
    router.push('/profile');
  };

  let errorDiv = <></>;
  if (error !== '') {
    errorDiv = (
      <pre className="signup-error">
        <b>Please fix the following error(s):</b>
        <br />
        {error}
      </pre>
    );
  }

  return (
    <div>
      <Head>
        <title>VHC - Edit Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="page">
        <p className="page-title">Edit Information</p>

        <form className="signup-form" onSubmit={submitHandler}>
          <div className="signup-form-container">
            <div className="signup-container">
              <label htmlFor="firstName" className="signup-label">
                First Name:
              </label>
              <label htmlFor="lastName" className="signup-label">
                Last Name:
              </label>
              <label htmlFor="email" className="signup-label">
                Email Address:
              </label>
              <label htmlFor="email" className="signup-label">
                Confirm Email Address:
              </label>
              <label htmlFor="pass" className="signup-label">
                Are you a client of Dr. Dawson?
              </label>
            </div>
            <div className="signup-container">
              <input type="text" name="firstName" value={firstName} onChange={(event) => setfirstName(event.target.value)} />
              <input type="text" name="lastName" value={lastName} onChange={(event) => setlastName(event.target.value)} />
              <input type="text" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <input type="text" name="email" value={emailConfirm} onChange={(event) => setEmailConfirm(event.target.value)} />
              {client === true ? (<><input type="checkbox" name="client" checked onChange={(event) => setClient(event.target.checked)} /></>) : <></>}
              {client === false ? (<><input type="checkbox" name="client" onChange={(event) => setClient(event.target.checked)} /></>) : <></>}
            </div>
          </div>
          <p id="sub"><u>Current account information:</u></p>
          <p id="sub"><em>{accountInfo.first_name}</em></p>
          <p id="sub"><em>{accountInfo.last_name}</em></p>
          <p id="sub"><em>{accountInfo.email}</em></p>
          {clientStatus === true ? (<><p id="sub">Client (✓)</p></>) : <></>}
          {clientStatus === false ? (<><p id="sub">Non-Client (x)</p></>) : <></>}
          <div style={{ textAlign: 'center', marginBottom: '2em' }}>
            <input type="submit" name="submit" value="Confirm" className="signup-submit" />
          </div>
          <Link href="/profile">
            <div id="return-btn">Back</div>
          </Link>
          {errorDiv}
        </form>
        <Link href="/edit-password">
          <div id="change-pass-btn">Change Password</div>
        </Link>
      </div>
    </div>
  );
}
