/* eslint-disable react/jsx-no-target-blank */
import Head from 'next/head';
import Header from '../../components/Header';

function CrisisPage() {
  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Are You In Crisis?</p>
        <div className="signup-form">
          This app is not a crisis management tool.
          If you are in crisis or seriously considering suicide, please call 911 or a crisis line.
          <br />
          <br />
          The major crisis line resource in British Columbia is:
          <br />
          <h2>Crisis Intervention and Suicide Prevention Centre of BC</h2>
          The Crisis Intervention and Suicide Prevention Centre of BC (Crisis Centre) is a
          non-profit volunteer organization
          committed to helping people help themselves and deal with crisis. 24 hours a day,
          7 days a week the Crisis Centre
          provides emotional support to youth, adults and seniors in distress.
          <br />
          <br />
          <a href="https://www.healthlinkbc.ca/mental-health-substance-use/resources/crisis-centre" target="_blank">https://www.healthlinkbc.ca/mental-health-substance-use/resources/crisis-centre</a>
          <br />
          <br />
          <a href="tel:1800SUICIDE">1-800-SUICIDE</a>
          {' '}
          (see website above for other phone-lines and resources)
        </div>
      </div>
    </div>
  );
}

export default CrisisPage;
