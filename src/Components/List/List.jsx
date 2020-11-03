import React from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import dayjs from 'dayjs';
import './List.css';

/*
lastEstimate = 7,14,30 = item.frequency
lastInterval = this purchase date minus last purchase date
numberOfPurchases = +1 each time bought √
*/

// record in db using purchaseItem function
// use estimates function to calculate estimated purchase date and record in db

export default function List({ items, token }) {
  let history = useHistory();

  const purchaseItem = (item) => {
    const normalizedName = formatString(item.name);
    // const date1 = dayjs(item.lastPurchased.toDate())
    // const date2 = dayjs(item.oldPurchased.toDate())
    // // const lastInterval = date1.diff(date2, 'h')

    // const lastInterval = (date1, date2) => {
    //   return date1.diff(date2, 'h');
    // };

    // console.log(item.lastPurchased.toDate(), item.oldPurchased.toDate(), lastInterval)

    db.collection('lists')
      .doc(token)
      .update({
        [normalizedName]: {
          name: item.name,
          frequency: item.frequency,
          lastPurchased: new Date(),
          oldPurchased: item.lastPurchased,
          numberOfPurchases:
            item.numberOfPurchases === undefined
              ? 1
              : item.numberOfPurchases + 1,
          // calculatedEstimate: calculateEstimate(item.frequency, lastInterval(new Date(), item.lastPurchased), numberOfPurchases),
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
