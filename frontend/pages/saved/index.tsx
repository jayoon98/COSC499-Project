import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';

function SavedPage() {
  return (
    <div>
      <Head>
        <title>VHC - Virtual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Survey submitted successfully!</p>
        <div style={{ textAlign: 'center' }}>
          <p className="saved-text">
            To save your answers, and to see your results,
            please sign up for a free account below.
          </p>
          <Link href="/signup">
            <div
              className="survey-submit"
            >
              Sign Up
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SavedPage;
