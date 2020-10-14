import React from 'react';
import { generateListToken, getListToken } from '../lib/tokens';
import { useHistory } from 'react-router-dom';

export default function Button({ token, setToken }) {
  let history = useHistory();

  const handleClick = () => {
    generateListToken();
    setToken(getListToken());
    history.push('/list');
  };

  return (
    <div>
      <button onClick={handleClick}>Get new token</button>
    </div>
  );
}
