/*
WHAT WORKS
- Sorts by calculatedEstimate time. Alphabetical doesn't work.
- Target inactive items. Gotta figure out what to do with them
- Created countdown of days to use for color code
- Color code items (reference issue to maybe adjust time lengths)

TO DO:
- Fix alphabetically
- Figure out what to do with inactives (do they need to coexist with color coded? If so, how?)
- Make color coded screen reader friendly 

BONUSES (stuff we'll probably get told to do during PRs):
- Turn if statements to Switch statements
- Refactor
  - Maybe make sorting and color coding their own file and import them
*/

import React from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import calculateEstimate from '../../lib/estimates';
import dayjs from 'dayjs';
import './List.css';

var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

// Update how many times an item has been bought once checked
const getNumberOfPurchases = (item) => {
  if (item.numberOfPurchases === undefined) {
    return 1;
  } else {
    return item.numberOfPurchases + 1;
  }
};

// Update when item was last bought to current date when checked
const getLastPurchaseDate = (item, currentDate) => {
  if (item.lastPurchased === null) {
    return currentDate;
  } else {
    return dayjs(item.lastPurchased.toDate());
  }
};

// When item is checked (purchased), the list will add/update 3 new objects and update 1 existing object
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

//Color code based on days until next purchase
const colorCode = (item) => {
  const soonLabel = 'soon';
  const kindOfSoonLabel = 'kindOfSoon';
  const notSoonLabel = 'notSoon';
  const notBought = 'notBought';
  const daysSincePurchased = dayjs().diff(
    getLastPurchaseDate(item, item.lastPurchased),
    'day',
  );
  const estimatedCountdown = item.calculatedEstimate - daysSincePurchased;

  if (estimatedCountdown <= 7) {
    return soonLabel;
  } else if (estimatedCountdown <= 14) {
    return kindOfSoonLabel;
  } else if (14 < estimatedCountdown) {
    return notSoonLabel;
  } else if (isNaN(estimatedCountdown)) {
    return notBought;
  } else {
    return null;
  }
};

// If item is inactive, do something to it
const isInactive = (item) => {
  const elapsedTime = dayjs().isSameOrAfter(
    dayjs(getLastPurchaseDate(item, item.lastPurchased)).add(
      item.calculatedEstimate * 2,
      'day',
    ),
  );

  const inactiveLabel = (
    <label htmlFor={item.name} className="inactive">
      {item.name}
    </label>
  );

  if (elapsedTime === true) {
    return inactiveLabel;
  } else {
    return null;
  }
};

export default function List({ items, token }) {
  let history = useHistory();

  // Once item is checked, it can't be rechecked for 24 hours and is disabled
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

  // Search filter
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
            {/* Sort items by soonest to latest estimated repurchase  */}
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
                  //This doesn't order names as it should. Tried name, item.name, making item.name a variable
                  if (a.name.localeCompare(b.name) && a.name < b.name) {
                    return -1;
                  }
                }
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
                    {isInactive(item)}{' '}
                    {/*temporarily overwriting label until we figure out what to do with inactives */}
                    <label htmlFor={item.name} className={colorCode(item)}>
                      {item.name}
                    </label>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
