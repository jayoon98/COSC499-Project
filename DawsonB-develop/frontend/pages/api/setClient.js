import axios from 'axios';
import * as Constants from '../../constants';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { authkey, uid, makeClient } = JSON.parse(req.body);

  await axios.post(`${Constants.BACKEND}/setClient`, {
    authkey,
    uid,
    makeClient,
  })
    .then((r) => {
      res.status(200).json(r.data);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
}

export default handler;
