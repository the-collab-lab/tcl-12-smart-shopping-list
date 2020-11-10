import React from 'react';

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
    <div className="Modal DeleteModal">
      Are you sure you want to delete "{itemName}" from the list?
      <button onClick={hideModal}>No</button>
      <button onClick={confirmDelete}>Yes</button>
    </div>
  );
}
