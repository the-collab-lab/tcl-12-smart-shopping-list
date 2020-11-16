import React from 'react';
import Modal from 'react-modal';

export default function AlertModal({ message, modalIsOpen, hideModal }) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={hideModal}
      contentLabel="Alert Modal"
      className="DeleteModal"
      overlayClassName="Modal"
    >
      <p>{message}</p>
      <div className="DeleteButtons">
        <button className="Button" onClick={hideModal}>
          Close
        </button>
      </div>
    </Modal>
  );
}
