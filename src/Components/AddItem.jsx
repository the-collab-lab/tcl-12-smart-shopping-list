import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';

export default function AddItem() {
  let location = useLocation();

  return (
    <div>
      {localStorage.getItem('token') === null &&
      location.pathname === '/add-item' ? (
        <Redirect to="/" />
      ) : (
        <div>Hi from Add an Item View!</div>
      )}
    </div>
  );
}
