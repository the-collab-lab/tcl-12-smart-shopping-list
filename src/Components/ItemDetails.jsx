import React from 'react';
import dayjs from 'dayjs';
import '../styles/Modal.css';

export default function ItemDetails({ item }) {
  const lastPurchaseDate = item.lastPurchased
    ? dayjs(item.lastPurchased.toDate()).format('MMMM D, YYYY')
    : 'Not available';
  const nextPurchaseDate = item.lastPurchased
    ? dayjs(item.lastPurchased.toDate()).add(item.calculatedEstimate, 'd')
    : null;

  const nextPurchaseDateStr = nextPurchaseDate
    ? nextPurchaseDate.format('MMMM D, YYYY')
    : 'Not available';

  const isOverdue = dayjs().diff(nextPurchaseDate, 'd') > 0;

  return (
    <div className="detailsModal">
      <h1>{item.name}</h1>
      <div className="detailsField">
        <h3>Last Purchase Date:</h3>
        <span>{lastPurchaseDate}</span>
      </div>
      <div className="detailsField">
        <h3>Next Purchase Date:</h3>
        <span>{nextPurchaseDateStr}</span>
        <span className="overdue">{isOverdue ? 'Overdue' : ''}</span>
      </div>
      <div className="detailsField">
        <h3>Number of Purchases:</h3>
        <span>{item.numberOfPurchases || '0'}</span>
      </div>
    </div>
  );
}
