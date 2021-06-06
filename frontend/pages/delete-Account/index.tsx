/* eslint-disable max-len */
import Head from 'next/head';
import 'react-image-picker/dist/index.css';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';

export default function deleteAccountPage() {
  const [auth, setAuth] = useLocalStorage('auth', { email: null, authkey: null });

  const router = useRouter();

  const submitHandler = (event) => {
    event.preventDefault();
    fetch('/api/deleteAccount', {
      method: 'POST',
      body: JSON.stringify({ authkey: auth.authkey }),
    }).then((response) => response.json())
      .then((response) => {
        if (response.status === 'done') {
          setAuth({ email: null, authkey: null });
          router.push('/');
        }
      });
  };

  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="page">
        <p className="page-title">Delete Account</p>

        <form className="signup-form" onSubmit={submitHandler}>
          <p id="deleteLog">
            By clicking
            <em> Confirm </em>
            below, you agree to deleting your Visual Health Circles Account.
            If that is your intended decision, then we would like to thank you for
            using our service. Take care!
          </p>
          <div style={{ textAlign: 'center', marginBottom: '2em' }}>
            <input type="submit" name="submit" value="Confirm" className="delete-submit" />
          </div>
        </form>

      </div>
    </div>
  );
}
