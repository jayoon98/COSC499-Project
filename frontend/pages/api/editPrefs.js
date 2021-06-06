import axios from 'axios';
import * as Constants from '../../constants';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const {
    authkey, pass1, pass2, pass3,
  } = JSON.parse(req.body);

  await axios.post(`${Constants.BACKEND}/updatePrefs`, {
    authkey,
    pass1,
    pass2,
    pass3,
  })
    .then((r) => {
      res.status(200).json(r.data);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
}

export default handler;
