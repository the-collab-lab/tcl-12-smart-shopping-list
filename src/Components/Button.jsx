import React from 'react';
import getToken from '../lib/tokens';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import List from './List';

export default function Button() {
  const generateNewToken = () => {
    localStorage.setItem('token', getToken());
    // return <List/>
  };

  return (
    // <Router>
    //   <Link exact to="/list">
    //     <button onClick={generateNewToken}>Get new token</button>
    //   </Link>
    // </Router>
    <Link exact to="/list">
      <button onClick={generateNewToken}>Get new token</button>
    </Link>
  );
}
