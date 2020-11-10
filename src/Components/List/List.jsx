import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { deleteItem } from '../../services/listService';
import { formatString } from '../../lib/helpers.js';
import calculateEstimate from '../../lib/estimates';
import dayjs from 'dayjs';
import './List.css';

import DeleteModal from '../DeleteModal/DeleteModal';

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
    return dayjs(item.lastPurchased.toDate());
  }
};

const purchaseItem = (item, token) => {
  const normalizedName = formatString(item.name);
  const numberOfPurchases = getNumberOfPurchases(item);
  const currentDate = dayjs(new Date());
  const lastPurchaseDate = getLastPurchaseDate(item, currentDate);
  const lastInterval = currentDate.diff(lastPurchaseDate, 'h') / 24;

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
          lastInterval,
          numberOfPurchases,
        ),
      },
    });
};

export default function List({ items, token }) {
  let history = useHistory();

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

  // Filtering list items
  const [searchItem, setSearchItem] = useState('');
  const handleChange = (e) => {
    setSearchItem(e.target.value);
  };

  const resetSearch = () => {
    setSearchItem('');
  };

  const results = !searchItem
    ? items
    : items.filter((item) =>
        item.name.toLowerCase().includes(searchItem.toLocaleLowerCase()),
      );

  // Delete modal confirmation
  const [deleteItemName, setDeleteItemName] = useState('');

  return (
    <div className="List">
      {items.length === 0 ? (
        <section className="listContainer emptyList">
          <h3>
            Your shopping list is empty. Add a new item to start your list.
          </h3>
          <button className="emptyButton" onClick={redirectPath}>
            Add New Item
          </button>
        </section>
      ) : (
        <section className="listContainer populatedList">
          <h3>Smart Shopping List</h3>

          <div className="search">
            <label htmlFor="itemSearch">Search Items: </label>
            <input
              id="itemSearch"
              type="text"
              placeholder="Enter item name..."
              value={searchItem}
              onChange={handleChange}
              aria-controls="itemsList"
            />
            {searchItem !== '' && (
              <button
                aria-label="Clear search"
                className="resetButton"
                onClick={resetSearch}
              >
                x
              </button>
            )}
          </div>

          <div role="region" id="itemsList" aria-live="polite">
            {results.map((item) => {
              let checked = isChecked(item);

              return (
                <div key={item.name}>
                  <input
                    type="checkbox"
                    className="checked"
                    id={item.name}
                    onChange={() => purchaseItem(item, token)}
                    checked={checked}
                    disabled={checked}
                    aria-label={`Mark as purchased`}
                  />
                  <label htmlFor={item.name}>{item.name}</label>
                  <button
                    className="deleteItem"
                    onClick={() => setDeleteItemName(item.name)}
                    aria-label={`Delete ${item.name}`}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>

          {deleteItemName !== '' && (
            <DeleteModal
              token={token}
              itemName={deleteItemName}
              setDeleteItemName={setDeleteItemName}
              deleteItem={deleteItem}
            />
          )}
        </section>
      )}
    </div>
  );
}
