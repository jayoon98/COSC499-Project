import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

function SubmittedPage() {
  const router = useRouter();

  function redirect() {
    setTimeout(() => {
      router.push('/domains');
    }, 3000);
  }

  if (process.browser) redirect();

  return (
    <div>
      <Head>
        <title>VHC - Virtual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Survey submitted successfully!</p>
      </div>
    </div>
  );
}

export default SubmittedPage;
