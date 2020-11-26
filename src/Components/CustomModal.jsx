import React from 'react';
import Modal from 'react-modal';
import '../styles/Modal.css';
import '../styles/Button.css';

export default function CustomModal({
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
      contentLabel={modalLabel || 'Alert'}
      className="Modal"
      overlayClassName="ModalOverlay"
    >
      <p>{modalMessage}</p>
      <div className="ModalButtons">
        <button className="Button cancelDelete" onClick={closeFunction}>
          {confirmFunction ? 'No' : 'Close'}
        </button>

        {confirmFunction && (
          <button className="Button confirmDelete" onClick={confirmFunction}>
            Yes
          </button>
        )}
      </div>
    </Modal>
  );
}
