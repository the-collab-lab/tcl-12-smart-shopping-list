import React, { useState } from 'react';
import NewTokenButton from '../NewTokenButton';
import JoinExistingList from '../JoinExistingList';
import CustomModal from '../CustomModal';
import './Home.css';

export default function Home({ setToken }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
        <CustomModal
          modalMessage={modalMessage}
          modalIsOpen={modalIsOpen}
          closeFunction={() => setModalIsOpen(false)}
        />
      </section>
    </div>
  );
}
