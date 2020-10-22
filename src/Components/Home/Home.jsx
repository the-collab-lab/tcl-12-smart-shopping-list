import React from 'react';
import NewTokenButton from '../NewTokenButton';
import ExistingTokenButton from '../ExistingTokenButton';
import './Home.css';

export default function Home({ setToken }) {
  return (
    <div className="home">
      <h1>Welcome to Your Shopping List!</h1>
      <section>
        <NewTokenButton setToken={setToken} />
        <p>- or -</p>

        <ExistingTokenButton setToken={setToken} />
      </section>
    </div>
  );
}
