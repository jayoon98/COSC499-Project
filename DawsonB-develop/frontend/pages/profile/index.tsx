/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
// Disable max line length for entire file.
/* eslint-disable max-len */
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';
import avatar from '../../constants/avatar';

export default function ProfilePage() {
  const [client, setClient] = useState(false);
  const [auth] = useLocalStorage('auth', { email: null, authkey: null });
  const [accountInfo] = useLocalStorage('prefs', {
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

  // Array used for ranking domains from database.
  const [ranking, setRanking] = useState([]);
  const [domainCols, setDomainCols] = useState([]);

  const router = useRouter();

  function loadAccount() {
    const temp = [];
    temp[accountInfo.circle_rank[0] - 1] = ['Physical'];
    temp[accountInfo.circle_rank[1] - 1] = ['Mental'];
    temp[accountInfo.circle_rank[2] - 1] = ['Emotional'];
    temp[accountInfo.circle_rank[3] - 1] = ['Spiritual'];
    temp[accountInfo.circle_rank[4] - 1] = ['Social'];
    setRanking(temp);

    const temp2 = [];
    temp2[accountInfo.circle_rank[0] - 1] = [accountInfo.circle_colors[0]];
    temp2[accountInfo.circle_rank[1] - 1] = [accountInfo.circle_colors[1]];
    temp2[accountInfo.circle_rank[2] - 1] = [accountInfo.circle_colors[2]];
    temp2[accountInfo.circle_rank[3] - 1] = [accountInfo.circle_colors[3]];
    temp2[accountInfo.circle_rank[4] - 1] = [accountInfo.circle_colors[4]];
    setDomainCols(temp2);
    setClient(accountInfo.isClient === 1);
  }
  useEffect(() => loadAccount(), []);

  // Make Fetch POST request here for account information, else redirect user to /login if authkey = null.
  if (auth.authkey == null && typeof window !== 'undefined') { router.push('/login'); }

  return (
    <>
      <div>
        <Head>
          <title>VHC - Visual Health Circles</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />

        <div className="page profile-page">

          <p className="page-title">Profile</p>

          <div className="container float">
            <div id="box">
              <h1 id="container-title">Account Information:</h1>
            </div>

            <h2 id="t1">Full Name:</h2>
            <div id="inner-box">
              <h2 id="fullName">{accountInfo.first_name + ' ' + accountInfo.last_name}</h2>
            </div>

            <h2 id="t1">Email:</h2>
            <div id="inner-box">
              <h2 id="info">{accountInfo.email}</h2>
            </div>

            <h2 id="t1">Account created on:</h2>
            <div id="inner-box">
              <h2 id="info">{accountInfo.date_created}</h2>
            </div>

            <h2 id="t1">Client status:</h2>
            <div id="inner-box">
              {client === true ? (<><h2 id="info">(✓) Client</h2></>) : <></>}
              {client === false ? (<><h2 id="info">(x) Non-Client</h2></>) : <></>}
            </div>
            <Link href="/edit-info">
              <div id="pB">Edit Account Information</div>
            </Link>
          </div>

          <div className="container">
            <div id="box"><h1 id="container-title">Preferences:</h1></div>
            <table className="preferences-table">
              <thead>
                <tr>
                  <th id="dth">Domain Rank.</th>
                  <th id="dth">Domain Title.</th>
                </tr>
              </thead>
              <tbody className="prefs-tbody">
                <tr>
                  <td id="dth">1.</td>
                  <td style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: '#' + domainCols[0],
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    border: 'solid 1px lightyellow',
                  }}
                  >
                    {ranking[0]}
                  </td>
                </tr>

                <tr>
                  <td id="dth">2.</td>
                  <td style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: '#' + domainCols[1],
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    border: 'solid 1px lightyellow',
                  }}
                  >
                    {ranking[1]}
                  </td>
                </tr>

                <tr>
                  <td id="dth">3.</td>
                  <td style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: '#' + domainCols[2],
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    border: 'solid 1px lightyellow',
                  }}
                  >
                    {ranking[2]}
                  </td>
                </tr>

                <tr>
                  <td id="dth">4.</td>
                  <td style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: '#' + domainCols[3],
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    border: 'solid 1px lightyellow',
                  }}
                  >
                    {ranking[3]}
                  </td>
                </tr>

                <tr>
                  <td id="dth">5.</td>
                  <td style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: '#' + domainCols[4],
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    border: 'solid 1px lightyellow',
                  }}
                  >
                    {ranking[4]}
                  </td>
                </tr>
              </tbody>
            </table>
            <h2 id="t1">Notify Time:</h2>
            <div id="inner-box">
              <h2 id="info">{accountInfo.notify_time + ' day(s)'}</h2>
            </div>
            <Link href="/edit-prefs">
              <div id="pB">Edit Preferences</div>
            </Link>
          </div>

          <div className="container">
            <div id="box">
              <h1 id="container-title">Avatar Panel:</h1>
            </div>
            <div id="inner-box">
              {accountInfo.avatar != null
                ? (
                  <div id="avatarHolder">
                    <img id="avatar" src={avatar.Backgrounds[accountInfo.avatar[0]]} alt="bg" />
                    <img id="avatar" src={avatar.Torsos[accountInfo.avatar[1]]} alt="torso" />
                    <img id="avatar" src={avatar.Skintones[accountInfo.avatar[2]]} alt="skintone" />
                    <img id="avatar" src={avatar.Moods[accountInfo.avatar[3]]} alt="mood" />
                    <img id="avatar" src={avatar.Hairs[accountInfo.avatar[4]]} alt="hair" />
                  </div>
                )
                : <></> }
            </div>
            <Link href="/edit-avatar">
              <div id="pB">Edit Avatar</div>
            </Link>
          </div>
          <Link href="/delete-Account">
            <div id="deleteAccount-btn">Delete Account</div>
          </Link>
        </div>
      </div>
    </>
  );
}
