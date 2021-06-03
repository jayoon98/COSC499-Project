import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import DomainContainer from '../../components/DomainContainer';

function DomainsPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState(<></>);

  let description = <></>;
  if (title !== '') {
    description = (
      <div className="domains-desc">
        <p className="domains-desc-title">{title}</p>
        <p className="domains-desc-text">{desc}</p>
      </div>
    );
  }

  const updateDesc = (t, d) => {
    setTitle(t);
    setDesc(d);
  };

  return (
    <div>
      <Head>
        <title>VHC - Visual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">My Domains</p>
        <DomainContainer props={{ updateDesc }} />
        {description}
      </div>
    </div>
  );
}
export default DomainsPage;
