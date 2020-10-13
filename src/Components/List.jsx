import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export default function List() {
  let location = useLocation();
  let history = useHistory();

  return (
    <div>
      {localStorage.getItem('token') === null &&
      location.pathname === '/list' ? (
        history.push('/')
      ) : (
        <div>Hi from List View!</div>
      )}
    </div>
  );
}
