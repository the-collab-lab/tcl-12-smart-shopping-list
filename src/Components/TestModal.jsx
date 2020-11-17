import React from 'react';
import Modal from 'react-modal';
import '../styles/Modal.css';
import '../styles/Button.css';
import './DeleteModal/DeleteModal.css';

export default function TestModal({
  modalIsOpen,
  modalLabel,
  modalMessage,
  closeFunction,
  confirmFunction,
}) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeFunction}
      contentLabel={modalLabel}
      className="DeleteModal"
      overlayClassName="Modal"
    >
      <p>{modalMessage}</p>
      <div className="DeleteButtons">
        <button className="Button cancelDelete" onClick={closeFunction}>
          {confirmFunction ? 'No' : 'Close'}
        </button>

        {confirmFunction && (
          <button
            className="Button PrimaryButton confirmDelete"
            onClick={confirmFunction}
          >
            Yes
          </button>
        )}
      </div>
    </Modal>
  );
}
