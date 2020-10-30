import React from 'react';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import dayjs from 'dayjs';
import './List.css';

export default function List({ items, token }) {
  const purchaseItem = (item) => {
    const normalizedName = formatString(item.name);
    db.collection('lists')
      .doc(token)
      .update({
        [normalizedName]: {
          name: item.name,
          frequency: item.frequency,
          lastPurchased: new Date(),
        },
      });
  };

  const isChecked = (item) => {
    if (item.lastPurchased === null) {
      return false;
    } else {
      const time = dayjs();
      const purchasedAt = dayjs(item.lastPurchased.toDate());
      const differenceInHours = time.diff(purchasedAt, 'h');

      return differenceInHours < 24;
    }
  };

  return (
    <div className="List">
      <h3>Item List:</h3>
      <ul>
        {items.map((item) => {
          let checked = isChecked(item);

          return (
            <div key={item.name}>
              <input
                type="checkbox"
                className="checked"
                id={item.name}
                onChange={() => purchaseItem(item)}
                checked={checked}
                disabled={checked}
              />
              <label htmlFor={item.name}>{item.name}</label>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
