import axios from 'axios';
import * as Constants from '../../constants';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const {
    authkey,
    question,
  } = JSON.parse(req.body);

  await axios.post(`${Constants.BACKEND}/editQuestion`, {
    authkey,
    ...question,
  })
    .then((r) => {
      res.status(200).json(r.data);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
}

export default handler;
