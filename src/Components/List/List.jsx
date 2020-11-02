import React from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import dayjs from 'dayjs';
import './List.css';

export default function List({ items, token }) {
  let history = useHistory();

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

  const redirectPath = () => {
    history.push('/add-item');
  };

  const [searchItem, setSearchItem] = React.useState('');
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
        <section className="listContainer">
          <div className="search">
            <label htmlFor="itemSearch">Search: </label>
            <input
              id="itemSearch"
              type="text"
              placeholder="Search"
              value={searchItem}
              onChange={handleChange}
            />
            {searchItem !== '' && (
              <button className="resetButton" onClick={resetSearch}>
                x
              </button>
            )}
          </div>

          <h3>Item List:</h3>

          <ul>
            {results.map((item) => {
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
