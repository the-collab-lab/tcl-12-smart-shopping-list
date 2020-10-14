import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';

export default function List({ token }) {
  let location = useLocation().pathname;

  return (
    <div>
      {token === null && location === '/list' ? (
        <Redirect to="/" />
      ) : (
        <div>Hi from List View!</div>
      )}
    </div>
  );
}
