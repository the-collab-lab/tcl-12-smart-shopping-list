import React from 'react';
import Modal from 'react-modal';
import '../../styles/Modal.css';
import '../../styles/Button.css';
import './DeleteModal.css';

export default function DeleteModal({
  token,
  itemName,
  modalIsOpen,
  setModalIsOpen,
  setItemToDelete,
  deleteItem,
}) {
  const hideModal = () => {
    setItemToDelete('');
    setModalIsOpen(false);
  };

  const confirmDelete = () => {
    deleteItem(token, itemName);
    hideModal();
    alert(`"${itemName}" has been deleted from your list.`);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={hideModal}
      contentLabel="Where is this?"
      className="DeleteModal"
      overlayClassName="Modal"
    >
      <p>Are you sure you want to delete "{itemName}" from the list?</p>
      <div className="DeleteButtons">
        <button className="Button cancelDelete" onClick={hideModal}>
          No
        </button>
        <button
          className="Button PrimaryButton confirmDelete"
          onClick={confirmDelete}
        >
          Yes
        </button>
      </div>
    </Modal>
  );
}
