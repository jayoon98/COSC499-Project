/* eslint-disable max-len */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import 'react-image-picker/dist/index.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';

export default function editPrefsPage() {
  const [notify, setNotify] = useState('');
  const [physical, setPhysical] = useState('');
  const [physicalColor, setPhysicalColor] = useState('');
  const [mental, setMental] = useState('');
  const [mentalColor, setMentalColor] = useState('');
  const [emotional, setEmotional] = useState('');
  const [emotionalColor, setEmotionalColor] = useState('');
  const [spiritual, setSpiritual] = useState('');
  const [spiritualColor, setSpiritualColor] = useState('');
  const [social, setSocial] = useState('');
  const [socialColor, setSocialColor] = useState('');
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

  function loadPrefs() {
    setPhysical(accountInfo.circle_rank[0].toString());
    setMental(accountInfo.circle_rank[1].toString());
    setEmotional(accountInfo.circle_rank[2].toString());
    setSpiritual(accountInfo.circle_rank[3].toString());
    setSocial(accountInfo.circle_rank[4].toString());
    setPhysicalColor(accountInfo.circle_colors[0]);
    setMentalColor(accountInfo.circle_colors[1]);
    setEmotionalColor(accountInfo.circle_colors[2]);
    setSpiritualColor(accountInfo.circle_colors[3]);
    setSocialColor(accountInfo.circle_colors[4]);
    setNotify(accountInfo.notify_time);
  }

  useEffect(() => loadPrefs(), [accountInfo.circle_colors]);

  // Array used for ranking domains from database.
  const [, setRanking] = useState([]);
  const [, setDomainCols] = useState([]);

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
    const physicalDiv = document.getElementById('physicalColor');
    physicalDiv.style.backgroundColor = `#${physicalColor}`;
    const mentalDiv = document.getElementById('mentalColor');
    mentalDiv.style.backgroundColor = `#${mentalColor}`;
    const emotionalDiv = document.getElementById('emotionalColor');
    emotionalDiv.style.backgroundColor = `#${emotionalColor}`;
    const spiritualDiv = document.getElementById('spiritualColor');
    spiritualDiv.style.backgroundColor = `#${spiritualColor}`;
    const socialDiv = document.getElementById('socialColor');
    socialDiv.style.backgroundColor = `#${socialColor}`;
  }
  useEffect(() => loadAccount(), [physicalColor]);

  const validate = () => {
    let errorText = '';

    // Throw error if any domains share the same color selection.
    if ((physicalColor === mentalColor) || (physicalColor === emotionalColor) || (physicalColor === spiritualColor) || (physicalColor === socialColor)
    || ((mentalColor === physicalColor) || (mentalColor === emotionalColor) || (mentalColor === spiritualColor) || (mentalColor === socialColor))
    || ((emotionalColor === physicalColor) || (emotionalColor === mentalColor) || (emotionalColor === spiritualColor) || (emotionalColor === socialColor))
    || ((spiritualColor === physicalColor) || (spiritualColor === emotionalColor) || (spiritualColor === mentalColor) || (spiritualColor === socialColor))
    || ((socialColor === physicalColor) || (socialColor === emotionalColor) || (socialColor === spiritualColor) || (socialColor === mentalColor))) {
      errorText += 'Two Domains cannot share the same color.\n';
    }

    // Throw error if any of the domain entries are empty.
    if (physical === '') {
      errorText += 'No value specified for Physical domain.\n';
    }

    if (mental === '') {
      errorText += 'No value specified for Mental domain.\n';
    }

    if (emotional === '') {
      errorText += 'No value specified for Emotional domain.\n';
    }

    if (spiritual === '') {
      errorText += 'No value specified for Spiritual domain.\n';
    }

    if (social === '') {
      errorText += 'No value specified for Social domain.\n';
    }

    // Throw error if any domain rankings equal one another.
    if ((physical === mental) || (physical === emotional) || (physical === spiritual) || (physical === social)
    || (mental === emotional) || (mental === physical) || (mental === spiritual) || (mental === social)
    || (emotional === physical) || (emotional === mental) || (emotional === social) || (emotional === spiritual)
    || (spiritual === physical) || (spiritual === mental) || (spiritual === social) || (spiritual === emotional)
    || (social === emotional) || (social === mental) || (social === physical) || (social === spiritual)) {
      errorText += 'Two Domains cannot share the same rank value.\n';
    }

    // Throw error if domain rank values are outside of (1-5).
    if ((Number(physical) < 1 || Number(physical) > 5) || (Number(mental) < 1 || Number(mental) > 5)
    || (Number(emotional) < 1 || Number(emotional) > 5) || (Number(spiritual) < 1 || Number(spiritual) > 5)
    || (Number(social) < 1 || Number(social) > 5)) {
      errorText += 'Domain rank must be within (1-5).\n';
    }

    setError(errorText);
    return errorText === '';
  };

  // Function utilized to wrap input values in domain ranker.
  const physicalWrapper = (event) => {
    event.preventDefault();
    if (event.target.value > 5) {
      setPhysical('1');
    } else if (event.target.value < 1) {
      setPhysical('5');
    } else {
      setPhysical(event.target.value);
    }
  };

  const mentalWrapper = (event) => {
    event.preventDefault();
    if (event.target.value > 5) {
      setMental('1');
    } else if (event.target.value < 1) {
      setMental('5');
    } else {
      setMental(event.target.value);
    }
  };

  const emotionalWrapper = (event) => {
    event.preventDefault();
    if (event.target.value > 5) {
      setEmotional('1');
    } else if (event.target.value < 1) {
      setEmotional('5');
    } else {
      setEmotional(event.target.value);
    }
  };

  const spiritualWrapper = (event) => {
    event.preventDefault();
    if (event.target.value > 5) {
      setSpiritual('1');
    } else if (event.target.value < 1) {
      setSpiritual('5');
    } else {
      setSpiritual(event.target.value);
    }
  };

  const socialWrapper = (event) => {
    if (event.target.value > 5) {
      setSocial('1');
    } else if (event.target.value < 1) {
      setSocial('5');
    } else {
      setSocial(event.target.value);
    }
  };

  const physicalColorSet = (event) => {
    const physicalDiv = document.getElementById('physicalColor');
    physicalDiv.style.backgroundColor = `#${event.target.value}`;
    setPhysicalColor(event.target.value);
  };

  const mentalColorSet = (event) => {
    const mentalDiv = document.getElementById('mentalColor');
    mentalDiv.style.backgroundColor = `#${event.target.value}`;
    setMentalColor(event.target.value);
  };

  const emotionalColorSet = (event) => {
    const emotionalDiv = document.getElementById('emotionalColor');
    emotionalDiv.style.backgroundColor = `#${event.target.value}`;
    setEmotionalColor(event.target.value);
  };

  const spiritualColorSet = (event) => {
    const spiritualDiv = document.getElementById('spiritualColor');
    spiritualDiv.style.backgroundColor = `#${event.target.value}`;
    setSpiritualColor(event.target.value);
  };

  const socialColorSet = (event) => {
    const socialDiv = document.getElementById('socialColor');
    socialDiv.style.backgroundColor = `#${event.target.value}`;
    setSocialColor(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const pass1 = `${notify}`;
    const pass2 = `${physicalColor},${mentalColor},${emotionalColor},${spiritualColor},${socialColor}`;
    const pass3 = `${physical}${mental}${emotional}${spiritual}${social}`;
    fetch('/api/editPrefs', {
      method: 'POST',
      body: JSON.stringify({
        authkey: auth.authkey,
        pass1,
        pass2,
        pass3,
      }),
    }).then((response) => response.json());
    setAccountInfo({
      ...accountInfo,
      circle_colors: pass2.split(','),
      circle_rank: pass3.split(''),
      notify_time: pass1,
    });
    router.push('/profile');
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
        <title>VHC - Edit Preferences</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="page">
        <p className="page-title">Edit Preferences</p>

        <div className="panel">
          <h1 className="panelHeading"><b><u>Notify Time:</u></b></h1>
          <p id="sub">
            <em>
              <u>
                Current Notify Timer:
                {` ${accountInfo.notify_time} `}
                day(s)
              </u>
            </em>
          </p>
          <p className="helperText">
            To change your notify timer setting, please make a selection below.
            <br />
            The Notify Timer is a great way to be reminded to continue your progress with VHC.
          </p>
          <select id="notifyTimer" onChange={(event) => setNotify(event.target.value)} value={notify}>
            <option value="1">1 Day</option>
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
          </select>
          <br />
        </div>
        <div className="panel">
          <h1 className="panelHeading"><b><u>Domain Colors:</u></b></h1>
        </div>
        <p id="tut1">Select the color for the domain you wish to change:</p>
        <div className="sel">
          <label htmlFor="physicalColor">Physical</label>
          <select id="physicalColor" className="colorDiv" value={physicalColor} onChange={(e) => physicalColorSet(e)}>
            <option value="419C59">Green</option>
            <option value="B1E3BB">Lime-Green</option>
            <option value="0D5C2A">Dark-Green</option>
            <option value="F5160A">Red</option>
            <option value="F59A95">Pink</option>
            <option value="0C6DCF">Blue</option>
            <option value="61A9F2">Light-Blue</option>
            <option value="104378">Dark-Blue</option>
            <option value="5B64C2">Purple</option>
            <option value="F0A93E">Orange</option>
          </select>
          <br />

          <label htmlFor="mentalColor">Mental</label>
          <select id="mentalColor" value={mentalColor} onChange={(e) => mentalColorSet(e)}>
            <option value="419C59">Green</option>
            <option value="B1E3BB">Lime-Green</option>
            <option value="0D5C2A">Dark-Green</option>
            <option value="F5160A">Red</option>
            <option value="F59A95">Pink</option>
            <option value="0C6DCF">Blue</option>
            <option value="61A9F2">Light-Blue</option>
            <option value="104378">Dark-Blue</option>
            <option value="5B64C2">Purple</option>
            <option value="F0A93E">Orange</option>
          </select>
          <br />

          <label htmlFor="emotionalColor">Emotional</label>
          <select id="emotionalColor" value={emotionalColor} onChange={(e) => emotionalColorSet(e)}>
            <option value="419C59">Green</option>
            <option value="B1E3BB">Lime-Green</option>
            <option value="0D5C2A">Dark-Green</option>
            <option value="F5160A">Red</option>
            <option value="F59A95">Pink</option>
            <option value="0C6DCF">Blue</option>
            <option value="61A9F2">Light-Blue</option>
            <option value="104378">Dark-Blue</option>
            <option value="5B64C2">Purple</option>
            <option value="F0A93E">Orange</option>
          </select>
          <br />

          <label htmlFor="spiritualColor">Spiritual</label>
          <select id="spiritualColor" value={spiritualColor} onChange={(e) => spiritualColorSet(e)}>
            <option value="419C59">Green</option>
            <option value="B1E3BB">Lime-Green</option>
            <option value="0D5C2A">Dark-Green</option>
            <option value="F5160A">Red</option>
            <option value="F59A95">Pink</option>
            <option value="0C6DCF">Blue</option>
            <option value="61A9F2">Light-Blue</option>
            <option value="104378">Dark-Blue</option>
            <option value="5B64C2">Purple</option>
            <option value="F0A93E">Orange</option>
          </select>
          <br />

          <label htmlFor="socialColor">Social</label>
          <select id="socialColor" value={socialColor} onChange={(e) => socialColorSet(e)}>
            <option value="419C59">Green</option>
            <option value="B1E3BB">Lime-Green</option>
            <option value="0D5C2A">Dark-Green</option>
            <option value="F5160A">Red</option>
            <option value="F59A95">Pink</option>
            <option value="0C6DCF">Blue</option>
            <option value="61A9F2">Light-Blue</option>
            <option value="104378">Dark-Blue</option>
            <option value="5B64C2">Purple</option>
            <option value="F0A93E">Orange</option>
          </select>
          <br />
        </div>
        <div className="panel">
          <h1 className="panelHeading"><b><u>Domain Ranking:</u></b></h1>
          <p className="helperText">
            Set your domain ranking preferences below.
            <br />
            These settings allow you to select which domains you would like to focus on.
          </p>
          <form className="domainRanker-form" onSubmit={submitHandler}>
            <div className="domainRanker-form-container">
              <label id="dName" htmlFor="physical">Physical: </label>
              <input type="number" id="physical" name="physical" value={physical} onChange={(e) => physicalWrapper(e)} />
              <br />
              <label id="dName" htmlFor="mental">Mental: </label>
              <input type="number" id="mental" name="mental" value={mental} onChange={mentalWrapper} />
              <br />
              <label id="dName" htmlFor="emotional">Emotional: </label>
              <input type="number" id="emotional" name="emotional" value={emotional} onChange={emotionalWrapper} />
              <br />
              <label id="dName" htmlFor="spiritual">Spiritual: </label>
              <input type="number" id="spiritual" name="spiritual" value={spiritual} onChange={spiritualWrapper} />
              <br />
              <label id="dName" htmlFor="social">Social: </label>
              <input type="number" id="social" name="social" value={social} onChange={socialWrapper} />
              <br />
            </div>
          </form>
        </div>
        {errorDiv}
        <div className="btnHolder">
          <button className="signup-submit" onClick={submitHandler} type="button">Confirm</button>
        </div>
        <Link href="/profile">
          <div id="return-btn">Back</div>
        </Link>
      </div>
    </div>
  );
}
