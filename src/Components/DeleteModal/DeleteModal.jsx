import React from 'react';
import '../../styles/Modal.css';
import '../../styles/Button.css';
import './DeleteModal.css';

export default function DeleteModal({
  token,
  itemName,
  setDeleteItemName,
  deleteItem,
}) {
  const hideModal = () => {
    setDeleteItemName('');
  };

  const confirmDelete = () => {
    deleteItem(token, itemName);
    hideModal();
  };

  return (
    <div className="Modal">
      <div className="DeleteModal">
        <p>Are you sure you want to delete "{itemName}" from the list?</p>
        <div className="DeleteButtons">
          <button className="Button cancelDelete" onClick={hideModal}>
            No
          </button>
          <button className="Button confirmDelete" onClick={confirmDelete}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
