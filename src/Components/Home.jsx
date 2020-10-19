import React from 'react';
import NewTokenButton from './NewTokenButton';
import ExistingTokenButton from './ExistingTokenButton';

function Home() {
  return (
    <div>
      <h1>Welcome to Your Shopping List</h1>
      <NewTokenButton />
      <ExistingTokenButton />
    </div>
  );
}

export default Home;
