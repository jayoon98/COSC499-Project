import Head from 'next/head';
import { useState, useEffect } from 'react';
import 'react-image-picker/dist/index.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import * as Avatar from '../../constants/avatar';
import useLocalStorage from '../../functions/useLocalStorage';

export default function editAvatarPage() {
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

  const [bg, setBg] = useState('');
  const [torso, setTorso] = useState('');
  const [skin, setSkin] = useState('');
  const [mood, setMood] = useState('');
  const [hair, setHair] = useState('');

  // Load images on initial page visit.
  function loadImages() {
    setBg(accountInfo.avatar[0].toString());
    setTorso(accountInfo.avatar[1].toString());
    setSkin(accountInfo.avatar[2].toString());
    setMood(accountInfo.avatar[3].toString());
    setHair(accountInfo.avatar[4].toString());
  }
  useEffect(() => loadImages(), [accountInfo.avatar]);

  const router = useRouter();

  const submitHandler = (event) => {
    event.preventDefault();
    const backgroundP = (document.getElementById('bgs') as HTMLInputElement).value;
    const torsoP = (document.getElementById('torsos') as HTMLInputElement).value;
    const skinP = (document.getElementById('skins') as HTMLInputElement).value;
    const moodP = (document.getElementById('moods') as HTMLInputElement).value;
    const hairP = (document.getElementById('hairs') as HTMLInputElement).value;
    const pass = `${backgroundP},${torsoP},${skinP},${moodP},${hairP}`;

    fetch('/api/preferences', {
      method: 'POST',
      body: JSON.stringify({
        authkey: auth.authkey,
        setting: 'avatar',
        value: pass,
      }),
    }).then((response) => response.json());
    setAccountInfo({ ...accountInfo, avatar: pass.split(',') });
    router.push('/profile');
  };

  return (
    <>
      <div>
        <Head>
          <title>VHC - Edit Avatar</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />

        <div className="page">
          <p className="page-title">Edit Avatar</p>
          <div className="panel">
            <h1 className="panelHeading"><b><u>Editor Panel:</u></b></h1>
            <form onSubmit={submitHandler}>
              <h2 className="category">Background:</h2>
              <img className="ovlay" src={Avatar.Backgrounds[bg]} alt="" />
              <select id="bgs" name="bgs" onChange={(event) => setBg(event.target.value)} value={bg}>
                <option value="1">Gray</option>
                <option value="2">White</option>
              </select>
              <h2 className="category">Torso:</h2>
              <img className="ovlay" src={Avatar.Torsos[torso]} alt="" />
              <select id="torsos" onChange={(event) => setTorso(event.target.value)} value={torso}>
                <option value="0">Blue T-shirt</option>
                <option value="4">Red T-Shirt</option>
                <option value="2">Green T-Shirt</option>
                <option value="3">Purple T-Shirt</option>
                <option value="6">Yellow T-Shirt</option>
              </select>
              <h2 className="category">Skin-tone:</h2>
              <img className="ovlay" src={Avatar.Skintones[skin]} alt="" />
              <select id="skins" onChange={(event) => setSkin(event.target.value)} value={skin}>
                <option value="0">Skintone 1</option>
                <option value="1">Skintone 2</option>
                <option value="2">Skintone 3</option>
              </select>
              <h2 className="category">Mood:</h2>
              <img className="ovlay" src={Avatar.Moods[mood]} alt="" />
              <select id="moods" onChange={(event) => setMood(event.target.value)} value={mood}>
                <option value="2">Excited</option>
                <option value="0">Bored</option>
                <option value="3">Happy</option>
                <option value="4">Laughing</option>
                <option value="5">Protected</option>
                <option value="6">Shy</option>
              </select>
              <h2 className="category">Hair:</h2>
              <img className="ovlay" src={Avatar.Hairs[hair]} alt="" />
              <select id="hairs" onChange={(event) => setHair(event.target.value)} value={hair}>
                <option value="2">Short</option>
                <option value="1">Messy</option>
                <option value="0">Long</option>
              </select>
            </form>
          </div>
          <div className="panel">
            <h1 className="panelHeading"><b><u>Avatar Preview:</u></b></h1>
            <div className="avatarPreview">
              <img className="previewOverlay" src={Avatar.Backgrounds[bg]} alt="" />
              <img className="previewOverlay" src={Avatar.Torsos[torso]} alt="" />
              <img className="previewOverlay" src={Avatar.Skintones[skin]} alt="" />
              <img className="previewOverlay" src={Avatar.Moods[mood]} alt="" />
              <img className="previewOverlay" src={Avatar.Hairs[hair]} alt="" />
              <img src="" className="previewOverlay" alt="" />
            </div>
            <div id="btnHolder">
              <button className="signup-submit" onClick={submitHandler} type="button">Confirm</button>
            </div>
          </div>
          <Link href="/profile">
            <div id="return-btn">Back</div>
          </Link>
        </div>
      </div>
    </>
  );
}
