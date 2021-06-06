import Head from 'next/head';
import React, { useState } from 'react';
import 'react-image-picker/dist/index.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';

export default function editInfoPage() {
  const [password, setPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [auth] = useLocalStorage('auth', { email: null, authkey: null });
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

    // Ensure new passwords match.
    if (newPass !== confirmPass) { errorText += 'New Passwords do not match.\n'; }

    // Check for any empty fields.
    if (newPass === '' || confirmPass === '' || password === '') { errorText += 'Form cannot contain empty fields.\n'; }

    // Make sure new passwords meet password length.
    if (newPass.length < 8 || confirmPass.length < 8) { errorText += 'Password length must be atleast 8 characters.\n'; }

    setError(errorText);
    return errorText === '';
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!validate()) return;

    fetch('/api/editPassword', {
      method: 'POST',
      body: JSON.stringify({
        authkey: auth.authkey,
        current_pass: password,
        new_pass: newPass,
      }),
    }).then((response) => response.json())
      .then((response) => {
        if (response.status === 'valid') {
          setAccountInfo({
            email: accountInfo.email,
            password: newPass, // Set new password.
            first_name: accountInfo.first_name,
            last_name: accountInfo.last_name,
            last_login: accountInfo.last_login,
            date_created: accountInfo.date_created,
            isClient: accountInfo.isClient,
            isAdmin: accountInfo.isAdmin,
            circle_colors: accountInfo.circle_colors,
            circle_rank: accountInfo.circle_rank,
            notify_time: accountInfo.notify_time,
            avatar: accountInfo.avatar,
          });
          router.push('/profile');
        } else if (response.status === 'invalid') { setError('Invalid current password!\n'); } else {
          setError('New pasword must differ from current.\n');
        }
      });
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
        <p className="page-title">Change Password</p>

        <form className="signup-form" onSubmit={submitHandler}>
          <div className="signup-form-container">
            <div className="signup-container">
              <label htmlFor="password" className="signup-label">Current password:</label>
              <label htmlFor="newPass" className="signup-label">New Password:</label>
              <label htmlFor="confirmPass" className="signup-label">Confirm New Password:</label>
            </div>
            <div className="signup-container">
              <input type="text" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <input type="text" name="newPass" value={newPass} onChange={(event) => setNewPass(event.target.value)} />
              <input type="text" name="confirmPass" value={confirmPass} onChange={(event) => setConfirmPass(event.target.value)} />
            </div>
          </div>
          {errorDiv}
          <div style={{ textAlign: 'center', marginBottom: '2em' }}>
            <input type="submit" name="submit" value="Confirm" className="signup-submit" />
          </div>
          <Link href="/edit-info">
            <div id="return-btn">Back</div>
          </Link>
        </form>
      </div>
    </div>
  );
}
