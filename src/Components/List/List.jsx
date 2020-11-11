import React from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import calculateEstimate from '../../lib/estimates';
import dayjs from 'dayjs';
import './List.css';

// var relativeTime = require('dayjs/plugin/relativeTime');
// dayjs.extend(relativeTime);

var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

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
  const calculatedEstimate = calculateEstimate(
    item.frequency,
    lastInterval,
    numberOfPurchases,
  );

  db.collection('lists')
    .doc(token)
    .update({
      [normalizedName]: {
        name: item.name,
        frequency: item.frequency,
        lastPurchased: new Date(),
        oldPurchased: item.lastPurchased,
        numberOfPurchases: numberOfPurchases,
        calculatedEstimate: calculatedEstimate,
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

  const setElapsedTime = (item) => {
    const elapsedTime = dayjs().isSameOrAfter(
      dayjs(getLastPurchaseDate(item, item.lastPurchased)).add(
        item.calculatedEstimate * 2,
        'day',
      ),
    );
    if (elapsedTime === true) {
      console.log(elapsedTime);
    } else {
      return null;
    }
  };
  // console.log(setElapsedTime());

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
            {/*
              Successfully sorts by calculatedEstimate time. Alphabetical doesn't work.
              TO DO:
              - Fix alphabetically
              - Create inactive (time since lastPurchased > (calculatedEstimate x2))
              - Color code items with if or switch
              - Create some kind of countdown of days? (Maybe find a way to get Dayjs to do that with calendar dates?)
              */}

            {results
              .sort((a, b) => {
                // to remove yellow =>, change to Switch statement since there's no else
                if (
                  a.calculatedEstimate < b.calculatedEstimate ||
                  b.calculatedEstimate === undefined
                ) {
                  return -1;
                } else if (a.calculatedEstimate > b.calculatedEstimate) {
                  return 1;
                } else if (a.calculatedEstimate === b.calculatedEstimate) {
                  //   a.lastPurchased === b.lastPurchased &&
                  //   a.item.lastPurchased === undefined
                  // ) {
                  //This doesn't order names as it should. Tried name, item.name, making item.name a variable
                  // if (a.lastPurchased == null) {
                  if (a.name.localeCompare(b.name) && a.name < b.name) {
                    return -1;
                  }
                }
                // console.log();
              })
              .map((item) => {
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
                    />
                    <label htmlFor={item.name}>{item.name}</label>

                    {
                      console.log(
                        // (item.calculatedEstimate * 2) >= item.currentDate.diff(item.lastPurchaseDate),
                        // dayjs(
                        //   getLastPurchaseDate(item, item.lastPurchased),
                        // ).from(getLastPurchaseDate(item, item.currentDate)),
                        item.calculatedEstimate,

                        // const timeFrames = dayjs(item.calculatedEstimate * 2) - dayjs(item.lastPurchased);
                      ) /*Using to see how items are ordered when sorted */
                    }
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
