import React from 'react';
import NewTokenButton from './NewTokenButton';
import ExistingTokenButton from './ExistingTokenButton';

export default function Home({ setToken }) {
  return (
    <div>
      <h1>Welcome to Your Shopping List</h1>
      <NewTokenButton setToken={setToken} />{' '}
      {/*Had to pass setToken down from Routes > Home to Home > Button so NewToken button still works */}
      <br />
      <ExistingTokenButton setToken={setToken} />
    </div>
  );
}
