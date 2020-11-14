import React from 'react';
import '../../styles/Modal.css';
import '../../styles/Button.css';
import './DeleteModal.css';

export default function DeleteModal({
  token,
  itemName,
  setItemToDelete,
  deleteItem,
}) {
  const hideModal = () => {
    setItemToDelete('');
  };

  const confirmDelete = () => {
    deleteItem(token, itemName);
    hideModal();
    alert(`"${itemName}" has been deleted from your list.`);
  };

  // Close modal when clicking outside modal dialog
  const closeOuterModal = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    hideModal();
  };

  return (
    <div className="Modal" onClick={closeOuterModal}>
      <div className="DeleteModal">
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
      </div>
    </div>
  );
}
