import { useState, useEffect } from 'react';
import DomainCircle from '../DomainCircle';
import useLocalStorage from '../../functions/useLocalStorage';
import * as Constants from '../../constants/index';
import * as Desc from '../../constants/descriptions';

export default function DomainContainer({ props }) {
  const { updateDesc } = props;
  const [domains, setDomains] = useState([]);
  const [scores, setScores] = useState([]);
  const [prefs] = useLocalStorage('prefs', {
    first_name: null,
    last_name: null,
    date_created: null,
    last_login: null,
    isClient: null,
    isAdmin: null,
    circle_colors: null,
    circle_rank: null,
    notify_time: null,
    avatar: null,
  });
  const [auth] = useLocalStorage('auth', { email: null, authkey: null });

  useEffect(() => {
    fetch('/api/getScore', {
      method: 'POST',
      body: JSON.stringify({
        authkey: auth.authkey,
      }),
    }).then((response) => response.json())
      .then((response) => {
        setScores(response);
        // eslint-disable-next-line no-alert
        if (response.error) alert('You have to complete a survey before you can view your domain results!');
      });
  }, []);

  const mapDomains = () => {
    const temp = [];

    prefs.circle_rank.forEach((d) => {
      const scoresLoaded = scores.length > 0;
      let color = '';
      let title = '';
      let desc = <></>;
      let score = 0;

      switch ((parseInt(d, 10))) {
        case Constants.PHYSICAL:
          color = prefs.circle_colors[Constants.PHYSICAL - 1];
          title = 'Physical';
          desc = Desc.PHYSICAL_DESC;
          score = scoresLoaded ? scores[0] / 10 : null;
          break;
        case Constants.MENTAL:
          color = prefs.circle_colors[Constants.MENTAL - 1];
          title = 'Mental';
          desc = Desc.MENTAL_DESC;
          score = scoresLoaded ? scores[1] / 10 : null;
          break;
        case Constants.EMOTIONAL:
          color = prefs.circle_colors[Constants.EMOTIONAL - 1];
          title = 'Emotional';
          desc = Desc.EMOTIONAL_DESC;
          score = scoresLoaded ? scores[2] / 10 : null;
          break;
        case Constants.SPIRITUAL:
          color = prefs.circle_colors[Constants.SPIRITUAL - 1];
          title = 'Spiritual';
          desc = Desc.SPIRITUAL_DESC;
          score = scoresLoaded ? scores[3] / 10 : null;
          break;
        case Constants.SOCIAL:
          color = prefs.circle_colors[Constants.SOCIAL - 1];
          title = 'Social';
          desc = Desc.SOCIAL_DESC;
          score = scoresLoaded ? scores[4] / 10 : null;
          break;
        default:
      }

      temp.push(
        <div
          style={{ width: '20%', display: 'inline-block', cursor: 'pointer' }}
          tabIndex={d}
          role="button"
          onKeyDown={() => updateDesc(title, desc)}
          onClick={() => updateDesc(title, desc)}
          key={title}
        >
          <DomainCircle props={{ color, score, title }} />
        </div>,
      );
    });
    setDomains(temp);
  };
  useEffect(mapDomains, [scores]);

  return (
    <div className={`domain-container ${scores.length === 0 ? 'loading' : ''}`}>
      <div className="click-prompt">Click on a Domain!</div>
      { domains }
    </div>
  );
}
