/* eslint-disable max-len */
import Head from 'next/head';
import Header from '../../components/Header';

function InformationPage() {
  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Information</p>

        {/* <h1 className="panelHeading"><b><u>Welcome to Visual Health Circles</u></b></h1> */}
        <div className="signup-form" style={{ maxWidth: '80%', lineHeight: '1.4' }}>
          <h1 style={{ textAlign: 'center' }}>Welcome to Visual Health Circles</h1>
          <p className="pBlock">
            Got health problems? Want to learn more about your health? Want to know how
            to improve your health? If you answered yes to any of these questions, the Health
            Circles app is for you! Learn what concerns you most about your health and what to do about it!
          </p>

          <ul>
            <li>Get motivated to improve your health</li>
            <li>Explore your health</li>
            <li>Complete short questionnaires and track your progress</li>
            <li>Prioritize the health domain most important to you</li>
            <li>Become knowledgeable, aware, and take action</li>
            <li>IMPROVE YOUR HEALTH – ONE CIRCLE AT A TIME!</li>
          </ul>

          <p className="pBlock">
            This app gives you the opp to map and learn about your health patterns, your ups and your downs over time.
            Identifying these patterns as uniquely yours, you get information that includes recommendations for improving your health.
            You can use the app to help discover the recommendations that work best for you. First and foremost, just monitoring your
            health patterns helps you be more mindful of the key systems you are made of.
          </p>

          <p className="pBlock">
            Since your health is vitally important to your quality of life, than self-monitoring can help you be more aware of changes
            you would not otherwise notice!
          </p>

          <p className="pBlock">
            You are complex and multidimensional. You are made up of at least five health systems or domains - Physical, Mental, Emotional,
            Social, and Spiritual. The aim of this app is to help you learn how understanding these four health states can change your life.
            The app stores and tracks your responses in these stats and provides options to create account, save, print, share, compare, and
            select and prioritize your health domains with future reminders. Ultimately, this app will help you devote yourself to your overall
            well-being. Plus, the app is free with opportunities to upgrade.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InformationPage;
