import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { MdDeleteForever } from 'react-icons/md';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';

export default function UserTable({ props }) {
  const [users, setUsers] = useState([]);
  const { authkey } = props;

  async function getUsers() {
    await fetch('/api/getUsers', {
      method: 'POST',
      body: JSON.stringify({
        authkey,
      }),
    }).then((res) => res.json())
      .then((res) => {
        if (!res.error) setUsers(res.users);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    ReactTooltip.hide();
    ReactTooltip.rebuild();
  });

  async function deleteUser(i, uid) {
    await fetch('/api/adminDeleteUser', {
      method: 'POST',
      body: JSON.stringify({
        authkey,
        uid,
      }),
    }).then(() => getUsers());
  }

  async function adminUser(i, uid) {
    await fetch('/api/setAdmin', {
      method: 'POST',
      body: JSON.stringify({
        authkey,
        uid,
        makeAdmin: users[i][3] === 0,
      }),
    }).then(() => getUsers());
  }

  async function clientUser(i, uid) {
    await fetch('/api/setClient', {
      method: 'POST',
      body: JSON.stringify({
        authkey,
        uid,
        makeClient: users[i][2] === 0,
      }),
    }).then(() => getUsers());
  }

  return (
    <>
      <div className="admin-panel-table-container">
        <table className="admin-panel-table">
          <caption>Users</caption>
          <thead>
            <tr>
              <th>UID</th>
              <th>Email</th>
              <th>Client</th>
              <th>Admin</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users ? users.map((x, i) => (
              <tr key={`tr-${x[0]}`}>
                <td>{x[0]}</td>
                <td>{x[1]}</td>
                <td>
                  <ReactTooltip />
                  {x[2] === 1 ? <AiFillCheckCircle className="blue-user-icon" onClick={() => clientUser(i, x[0])} data-tip="Client.<br/>Click to remove client status." data-background-color="#555555" data-multiline="true" /> : <AiFillCloseCircle className="red-user-icon" onClick={() => clientUser(i, x[0])} data-tip="Not a client.<br/>Click to make user a client." data-background-color="#555555" data-multiline="true" />}
                </td>
                <td>
                  <ReactTooltip />
                  {x[3] === 1 ? <AiFillCheckCircle className="blue-user-icon" onClick={() => adminUser(i, x[0])} data-tip="Admin.<br/>Click to remove admin status." data-background-color="#555555" data-multiline="true" /> : <AiFillCloseCircle className="red-user-icon" onClick={() => adminUser(i, x[0])} data-tip="Not an admin.<br/>Click to make user admin." data-background-color="#555555" data-multiline="true" />}
                </td>
                <td>
                  <ReactTooltip />
                  <MdDeleteForever className="red-user-icon" onClick={() => deleteUser(i, x[0])} data-tip="Permanently delete this user." data-background-color="#555555" data-multiline="true" />
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
