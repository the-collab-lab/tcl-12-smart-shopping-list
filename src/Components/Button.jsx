import React, { useState } from 'react';
import getToken from '../lib/tokens';
import { Link } from 'react-router-dom';

export default function Button() {
  const [hidden, setHidden] = useState(false);

  const generateNewToken = () => {
    localStorage.setItem('token', getToken());
    setHidden(true);
  };

  return (
    <div>
      {hidden === true || localStorage.getItem('token') !== null ? null : (
        <Link exact to="/list">
          <button onClick={generateNewToken}>Get new token</button>
        </Link>
      )}
    </div>
  );
}
