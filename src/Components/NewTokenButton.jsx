import React from 'react';
import { generateListToken, getListToken } from '../lib/tokens';
import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase';

export default function Button({ setToken }) {
  let history = useHistory();

  const handleClick = () => {
    generateListToken();
    setToken(getListToken());
    db.collection('lists').doc(getListToken()).set({ items: [] });
    history.push('/list');
  };

  return (
    <div className="token">
      <button onClick={handleClick}>Create a new list</button>
    </div>
  );
}
