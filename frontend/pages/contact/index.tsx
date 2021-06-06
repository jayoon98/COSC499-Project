import Head from 'next/head';
import Header from '../../components/Header';

function ContactPage() {
  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Contact Therapist</p>

        <div className="signup-form" style={{ textAlign: 'center' }}>

          <h1>Dawson Psychological Services</h1>
          <h2>Dr. K.A. Dawson, Registered Psychologist (CPBC #1566)</h2>
          <br />

          <h3>Dr. Kim Dawson can be reached by: </h3>

          <b>Email: </b>
          <a href="mailto:kadawsonphd@gmail.com">kadawsonphd@gmail.com</a>
          <br />
          <br />
          <b>Phone: </b>
          <a href="tel:2508991794">(250)-899-1794</a>
          <br />
          <br />
          <b>Or in person at: </b>
          <br />
          1790 Barrie Rd.
          <br />
          Victoria, BC, V8N 2W7
          <br />
          Canada
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
