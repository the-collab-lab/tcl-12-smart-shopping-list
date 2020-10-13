import React from 'react';
import getToken from '../lib/tokens';
import { Link, Redirect } from 'react-router-dom';

export default function Button({ hidden, setHidden }) {
  const generateNewToken = () => {
    localStorage.setItem('token', getToken());
    setHidden(true);
  };

  return (
    <div>
      {hidden === true || localStorage.getItem('token') !== null ? (
        <Redirect to="/list" />
      ) : (
        <Link to="/list">
          <button onClick={generateNewToken}>Get new token</button>
        </Link>
      )}
    </div>
  );
}
