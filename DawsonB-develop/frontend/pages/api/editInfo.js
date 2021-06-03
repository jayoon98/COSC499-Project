import axios from 'axios';
import * as Constants from '../../constants';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const {
    authkey, firstName, lastName, email, client,
  } = JSON.parse(req.body);

  await axios.post(`${Constants.BACKEND}/editInfo`, {
    authkey,
    first_name: firstName,
    last_name: lastName,
    email,
    client,
  })
    .then((r) => {
      res.status(200).json(r.data);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
}

export default handler;
