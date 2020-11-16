import React, { useState } from 'react';
import NewTokenButton from '../NewTokenButton';
import JoinExistingList from '../JoinExistingList';
import AlertModal from '../AlertModal';
import './Home.css';

export default function Home({ setToken }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('test message');

  function setAlert(message) {
    setModalMessage(message);
    setModalIsOpen(true);
  }

  return (
    <div className="home">
      <h1>Welcome to Your Shopping List!</h1>
      <section>
        <NewTokenButton setToken={setToken} />
        <p>- or -</p>

        <JoinExistingList setToken={setToken} setAlert={setAlert} />
        <AlertModal
          message={modalMessage}
          modalIsOpen={modalIsOpen}
          hideModal={() => setModalIsOpen(false)}
        />
      </section>
    </div>
  );
}
