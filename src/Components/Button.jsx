import React, { useState } from 'react';
import getToken from '../lib/tokens';
import { Link, useHistory } from 'react-router-dom';
import List from './List';

export default function Button() {
  let history = useHistory();
  const [hidden, setHidden] = useState(false);

  const generateNewToken = () => {
    localStorage.setItem('token', getToken());
    setHidden(true);
  };

  return (
    <div>
      {hidden === true || localStorage.getItem('token') !== null ? (
        history.push('/list')
      ) : (
        <Link exact to="/list">
          <button onClick={generateNewToken}>Get new token</button>
        </Link>
      )}
    </div>
  );
}
