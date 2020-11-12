/*
WHAT WORKS
- Sorts by calculatedEstimate time. Alphabetical doesn't work.
- Target inactive items. Gotta figure out what to do with them
- Created countdown of days to use for color code
- Color code items (reference issue to maybe adjust time lengths)
- Make color coded screen reader friendly
- Turn if statements to Switch statements (Bonus)

TO DO:
- Fix alphabetically
- Figure out what to do with inactives (do they need to coexist with color coded? If so, how?)

BONUSES (stuff we'll probably get told to do during PRs):
- Refactor
  - Maybe make sorting and color coding their own file and import them
  - Any functions we can move out?
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

//Color code based on days until next purchase with corresponding aria label
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
    return ['inactive', 'Inactive'];
  } else if (estimatedCountdown <= 7) {
    return ['soon', 'Within 7 days'];
  } else if (estimatedCountdown <= 14) {
    return ['kindOfSoon', 'Between 7 and 14 days'];
  } else if (14 < estimatedCountdown) {
    return ['notSoon', 'More than 14 days'];
  } else if (isNaN(estimatedCountdown)) {
    return ['notBought', 'Never Bought Yet'];
  } else {
    return null;
  }
};

const sortItems = (a, b) => {
  const elapsedTime = dayjs().isSameOrAfter(
    dayjs(getLastPurchaseDate(a, a.lastPurchased)).add(
      a.calculatedEstimate * 2,
      'day',
    ),
  );
  if (
    a.calculatedEstimate < b.calculatedEstimate ||
    b.calculatedEstimate === undefined ||
    elapsedTime === true
  ) {
    console.log(a.name);
    return -1;
  }
  if (a.calculatedEstimate > b.calculatedEstimate) {
    return 1;
  }
  if (a.calculatedEstimate === b.calculatedEstimate) {
    //This doesn't order names as it should. Tried name, item.name, making item.name a variable
    return a.name.localeCompare(b.name);
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
            {results.sort(sortItems).map((item) => {
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
                  {/*temporarily overwriting label until we figure out what to do with inactives */}
                  <label
                    htmlFor={item.name}
                    className={colorCode(item)[0]}
                    aria-label={colorCode(item)[1]}
                  >
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
