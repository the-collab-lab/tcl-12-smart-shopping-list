import React from 'react';
import NewTokenButton from '../NewTokenButton';
import JoinExistingList from '../JoinExistingList';
import './Home.css';

export default function Home({ setToken }) {
  return (
    <div className="home">
      <h1>Welcome to Your Shopping List!</h1>
      <section>
        <NewTokenButton setToken={setToken} />
        <p>- or -</p>

        <JoinExistingList setToken={setToken} />
      </section>
    </div>
  );
}
