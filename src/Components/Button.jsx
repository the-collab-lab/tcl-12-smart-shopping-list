import React from 'react';
import getToken from '../lib/tokens';
import { useHistory } from 'react-router-dom';

export default function Button() {
  let history = useHistory();

  const generateNewToken = () => {
    localStorage.setItem('token', getToken());

    history.push('/list');
  };

  return <button onClick={generateNewToken}>Get new token</button>;
}
