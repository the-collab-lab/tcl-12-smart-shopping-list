import React from 'react';
// import { generateListToken, getListToken } from '../lib/tokens';
import { useHistory } from 'react-router-dom';
// import { createList } from '../services/listService';

export default function Button({ setToken }) {
  // let history = useHistory();

  const handleClick = () => {
    console.log('Creating new lists is disabled');
    // generateListToken();
    // const token = getListToken();
    // setToken(token);
    // createList(token);
    // history.push('/list');
  };

  return (
    <div className="token">
      <button className="Button HomeButton" onClick={handleClick}>
        Create a new list <i className="fas fa-plus" aria-hidden="true"></i>
      </button>
    </div>
  );
}
