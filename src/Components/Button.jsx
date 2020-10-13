import React from 'react';
import getToken from '../lib/tokens';
import { Link, useHistory } from 'react-router-dom';

export default function Button({ hidden, setHidden }) {
  let history = useHistory();

  const generateNewToken = () => {
    localStorage.setItem('token', getToken());
    setHidden(true);
  };

  return (
    <div>
      {hidden === true || localStorage.getItem('token') !== null ? (
        history.push('/list')
      ) : (
        <Link to="/list">
          <button onClick={generateNewToken}>Get new token</button>
        </Link>
      )}
    </div>
  );
}
