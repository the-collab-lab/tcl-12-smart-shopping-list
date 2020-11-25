import React from 'react';
import dayjs from 'dayjs';
import '../styles/Modal.css';

export default function ItemDetails({ item }) {
  const lastPurchaseDate = item.lastPurchased
    ? dayjs(item.lastPurchased.toDate()).format('MMMM D, YYYY')
    : 'Not available';
  const nextPurchaseDate = item.lastPurchased
    ? dayjs(item.lastPurchased.toDate())
        .add(item.calculatedEstimate, 'd')
        .format('MMMM D, YYYY')
    : 'Not available';

  return (
    <div className="detailsModal">
      <h1>{item.name}</h1>
      <div className="detailsField">
        <h3>Last Purchase Date:</h3>
        <span>{lastPurchaseDate}</span>
      </div>
      <div className="detailsField">
        <h3>Next Purchase Date:</h3>
        <span>{nextPurchaseDate}</span>
      </div>
      <div className="detailsField">
        <h3>Number of Purchases:</h3>
        <span>{item.numberOfPurchases || '0'}</span>
      </div>
    </div>
  );
}
