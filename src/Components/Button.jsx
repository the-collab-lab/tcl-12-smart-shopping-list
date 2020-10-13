import React from 'react';
import getToken from '../lib/tokens';
import { setListToken } from '../lib/tokens';
import { useHistory } from 'react-router-dom';

export default function Button() {
  let history = useHistory();

  const handleClick = () => {
    setListToken();
    // set token in state
    history.push('/list');
  };

  return <button onClick={handleClick}>Get new token</button>;
}
