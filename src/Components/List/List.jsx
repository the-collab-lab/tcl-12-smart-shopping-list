/*
WHAT WORKS
- Sorts by calculatedEstimate time. Alphabetical doesn't work.
- Target inactive items. Gotta figure out what to do with them
- Created countdown of days to use for color code
- Color code items (reference issue to maybe adjust time lengths)
- Make color coded screen reader friendly
- Order alphabetically

TO DO:
****** HELP ********
***** If you wanna give this a go, have at it! We're completely stuck at this point ******

1. Move inactive to bottom
  - calculatedEstimate is taking priority over Inactive, so it's staying in it's same calculatedEstimate spot.
  - When we try adding more conditionals related to "inactive" or "0" to .sort, it just breaks the working sort.
  - When console.logging pretty much anything we're having trouble with (For example "a.name" within the .sort), there's lots of repeats of the same item but we have no clue what's happening to make that happen
*/

import React from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../lib/firebase.js';
import { formatString } from '../../lib/helpers.js';
import calculateEstimate from '../../lib/estimates';
import dayjs from 'dayjs';
import './List.css';

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
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

//Color code based on days until next purchase or inactivity with corresponding aria label
const colorCode = (item) => {
  const daysSincePurchased = dayjs().diff(
    getLastPurchaseDate(item, item.lastPurchased),
    'day',
  );
  const estimatedCountdown = item.calculatedEstimate - daysSincePurchased;
  const elapsedTime = dayjs().isSameOrAfter(
    dayjs(getLastPurchaseDate(item, item.lastPurchased)).add(
      item.calculatedEstimate * 2,
      'day',
    ),
  );

  if (elapsedTime === true) {
    return ['inactive', ' Inactive'];
  } else if (estimatedCountdown <= 7) {
    return ['soon', ' Within 7 days'];
  } else if (estimatedCountdown <= 14) {
    return ['kindOfSoon', ' Between 7 and 14 days'];
  } else if (14 < estimatedCountdown) {
    return ['notSoon', ' More than 14 days'];
  } else if (isNaN(estimatedCountdown)) {
    return ['notBought', ' Never Bought Yet'];
  } else {
    return null;
  }
};

// Attempted to add className label to each item's frequency

// if (estimatedCountdown <= 7) {
//   item.className = 'soon';
// } else if (estimatedCountdown <= 14) {
//   item.className = 'kindOfSoon';
// } else if (14 < estimatedCountdown) {
//   item.className = 'notSoon';
// } else if (isNaN(estimatedCountdown)) {
//   item.className = 'notBought';
// }
// if (elapsedTime === true) {
//   item.className = 'inactive';
// } else {
//   return item;
// }

// Sort items by soonest to latest estimated repurchase
const sortItems = (a, b) => {
  if (b.name === undefined) {
    return -1;
  } else if (a.calculatedEstimate === b.calculatedEstimate) {
    return a.name.localeCompare(b.name, { sensitivity: 'base' });
  } else if (
    a.calculatedEstimate < b.calculatedEstimate ||
    b.calculatedEstimate === undefined
  ) {
    return -1;
  } else {
    return 1;
  }
};

// Attempted to compare className in order to reorder item order

// const sortItems = (a, b) => {
//     if (a.className === 'inactive' && b.className === 'inactive') {
//       return a.title.localeCompare(b.title);
//     }
//     if (a.className === 'inactive' && b.className !== 'inactive') {
//       return 1;
//     }
//     if (a.className !== 'inactive' && b.className === 'inactive') {
//       return -1;
//     }
//     if (a.className !== 'inactive' && b.className !== 'inactive') {
//       if (b.calculatedEstimate === undefined) {
//         return -1;
//       }
//     }
//     if (a.calculateEstimate > b.calculateEstimate) {
//       return 1;
//     }
//     if (a.calculateEstimate < b.calculateEstimate) {
//       return -1;
//     }
//     return a.name.localeCompare(b.name, { sensitivity: 'base' });
//   };
// };

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
            {results
              // .map(addClassName)
              .sort(sortItems)
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
                    <label htmlFor={item.name}>
                      {item.name}
                      <span
                        className={`${colorCode(item)[0]} badge`}
                        aria-hidden="true"
                      >
                        {colorCode(item)[1]}
                      </span>
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
