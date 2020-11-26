import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  deleteItem,
  purchaseItem,
  getLastPurchaseDate,
} from '../../services/listService';
import dayjs from 'dayjs';
import './List.css';
import ItemDetails from '../ItemDetails';
import CustomModal from '../CustomModal';

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

//Color code based on days until next purchase or inactivity with corresponding aria label
const colorCode = (item) => {
  const daysSincePurchased = dayjs().diff(
    getLastPurchaseDate(item, item.lastPurchased),
    'day',
  );
  if (item.calculatedEstimate === 0) {
    item.calculatedEstimate = item.frequency;
  }
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

// Sort items by soonest to latest estimated repurchase
const sortItems = (a, b) => {
  if (a.calculatedEstimate === 0) {
    a.calculatedEstimate = a.frequency;
  }
  const aInactive = dayjs().isSameOrAfter(
    dayjs(getLastPurchaseDate(a, a.lastPurchased)).add(
      a.calculatedEstimate * 2,
      'day',
    ),
  );

  if (b.calculatedEstimate === 0) {
    b.calculatedEstimate = b.frequency;
  }
  const bInactive = dayjs().isSameOrAfter(
    dayjs(getLastPurchaseDate(b, b.lastPurchased)).add(
      b.calculatedEstimate * 2,
      'day',
    ),
  );

  //Sort by inactive
  if (aInactive && bInactive) {
    return a.name.localeCompare(b.name, { sensitivity: 'base' });
  } else if (aInactive) {
    return 1;
  } else if (bInactive) {
    return -1;
  }

  //Sort by calculatedEstimate
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

export default function List({ items, token }) {
  // Filtering State
  const [searchItem, setSearchItem] = useState('');
  // Modal States
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmFunction, setConfirmFunction] = useState(null);
  const [modalLabel, setModalLabel] = useState('');

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

  // Filtering list items
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

  // Modal to delete item
  const closeModal = () => {
    setModalIsOpen(false);
  };

  function showAlert(message) {
    setModalMessage(message);
    setModalLabel(message); //not being read, possibly not re-rendering since just text is changing
    setModalIsOpen(true);
    setConfirmFunction(null);
  }

  //Sets up the modal for each item when user clicks the delete button
  function deleteHandler(itemName) {
    setModalMessage(
      `Are you sure you want to delete "${itemName}" from the list?`,
    );
    setModalLabel(`Modal to confirm deletion of ${itemName}`);
    setConfirmFunction(createDeleteFunction(itemName));
    setModalIsOpen(true);
  }

  //Creates the delete function for the item to be used in the modal
  function createDeleteFunction(itemName) {
    return function () {
      return async function () {
        deleteItem(token, itemName);
        showAlert(`"${itemName}" has been deleted from your list.`);

        const successfulDelete = await deleteItem(token, itemName);

        if (successfulDelete) {
          showAlert(`"${itemName}" has been deleted from your list.`);
        } else {
          showAlert(
            `Sorry, "${itemName}" cannot be deleted from your list at this time.`,
          );
        }
      };
    };
  }

  // Created function to view item details using modal
  function detailsHandler(item) {
    setModalMessage(<ItemDetails item={item} />);
    setModalLabel(`Details for ${item.name}`);
    setModalIsOpen(true);
    setConfirmFunction(null);
  }

  return (
    <>
      <h1>Smart Shopping List</h1>
      <div className="List">
        {items.length === 0 ? (
          <section className="listContainer emptyList">
            <h3>
              Your shopping list is empty. Add a new item to start your list.
            </h3>
            <button className="Button emptyButton" onClick={redirectPath}>
              Add New Item
            </button>
          </section>
        ) : (
          <section className="listContainer populatedList">
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
                  X
                </button>
              )}
            </div>

            <div role="region" id="itemsList" aria-live="polite">
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
                      aria-label={`Mark "${item.name}" as purchased`}
                    />

                    <label htmlFor={item.name}>
                      {item.name}
                      <span
                        className={`${colorCode(item)[0]} badge`}
                        // aria-hidden="true" // Removing this on Chrome and Firefox works. Safari repeats everything twice without it
                        //Note 2: Chrome and Firefox skip disabled items
                      >
                        {colorCode(item)[1]}
                      </span>
                    </label>

                    <div className="itemButtons">
                      <button
                        className="Button itemDetails"
                        onClick={() => detailsHandler(item)}
                        aria-label={`Details for ${item}`}
                      >
                        Details
                      </button>
                      <button
                        className="deleteItem"
                        onClick={() => deleteHandler(item.name)}
                        aria-label={`Delete ${item.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <CustomModal
              modalIsOpen={modalIsOpen}
              modalLabel={modalLabel}
              modalMessage={modalMessage}
              closeFunction={closeModal}
              confirmFunction={confirmFunction}
            />
          </section>
        )}
      </div>
    </>
  );
}
