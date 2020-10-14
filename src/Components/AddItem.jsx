import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';

export default function AddItem({ token }) {
  let location = useLocation().pathname;

  return (
    <div>
      {token === null && location === '/add-item' ? (
        <Redirect to="/" />
      ) : (
        <div>Hi from Add an Item View!</div>
      )}
    </div>
  );
}
