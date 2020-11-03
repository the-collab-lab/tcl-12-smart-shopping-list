import React from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import calculateEstimate from '../../lib/estimates';
import dayjs from 'dayjs';
import './List.css';

const getNumberOfPurchases = (item) => {
  if (item.numberOfPurchases === undefined) {
    return 1;
  } else {
    return item.numberOfPurchases + 1;
  }
};

const getLastPurchaseDate = (item, currentDate) => {
  if (item.lastPurchased === null) {
    return currentDate;
  } else {
    dayjs(item.lastPurchased.toDate());
  }
};

export default function List({ items, token }) {
  let history = useHistory();

  const purchaseItem = (item) => {
    const normalizedName = formatString(item.name);

    const lastInterval = (date1, date2) => {
      return date1.diff(date2, 'h') / 24;
    };

    const numberOfPurchases = getNumberOfPurchases(item);
    const currentDate = dayjs(new Date());
    const lastPurchaseDate = getLastPurchaseDate(item, currentDate);

    db.collection('lists')
      .doc(token)
      .update({
        [normalizedName]: {
          name: item.name,
          frequency: item.frequency,
          lastPurchased: new Date(),
          oldPurchased: item.lastPurchased,
          numberOfPurchases: numberOfPurchases,
          calculatedEstimate: calculateEstimate(
            item.frequency,
            lastInterval(currentDate, lastPurchaseDate),
            numberOfPurchases,
          ),
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

  const redirectPath = () => {
    history.push('/add-item');
  };

  return (
    <div className="List">
      {items.length === 0 ? (
        <section className="listContainer emptyList">
          <h3>
            Your shopping list is empty. Add a new item to start your list.
          </h3>
          <button onClick={redirectPath}>Add New Item</button>
        </section>
      ) : (
        <section className="listContainer">
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
        </section>
      )}
    </div>
  );
}
