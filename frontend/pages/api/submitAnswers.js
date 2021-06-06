import axios from 'axios';
import * as Constants from '../../constants';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const {
    answers,
    authkey,
  } = JSON.parse(req.body);

  await axios.post(`${Constants.BACKEND}/submitAnswers`, {
    answers,
    authkey,
  })
    .then((r) => {
      if (r.data.status === 200) {
        res.status(200).json(r.data);
      } else {
        throw new Error(`${r.data.status}: ${r.data.message}`);
      }
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
}

export default handler;
