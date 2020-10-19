import React from 'react';
import { getListToken } from '../lib/tokens';
// import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase';

export default function ExistingTokenButton({ token }) {
  // let history = useHistory();

  const handleClick = () => {
    console.log(db.collection('lists').doc('test-token'));
  };

  return (
    <div>
      <button onClick={handleClick}>Join Existing List</button>
      <br />
      <input></input>
    </div>
  );
}
