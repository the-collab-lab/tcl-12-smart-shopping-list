import React from 'react';
import getToken from '../lib/tokens';

export default function Button() {
  const generateNewToken = () => {
    localStorage.setItem('token', getToken());
  };

  return (
    <div>
      <button onClick={generateNewToken}>Get new token</button>
    </div>
  );
}
