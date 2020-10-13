import React, { useState } from 'react';
import firebase from 'firebase';
import { db } from '../lib/firebase';

// TODO: Add controlled form components to state

export default function AddItem() {
  const [token, setToken] = useState('test-token');

  function handleSubmit(evt) {
    evt.preventDefault();
    // TODO: Update with state form values

    const itemName = document.getElementById('item-name');
    console.log(itemName.value);

    const itemFrequency = document.getElementsByName('item-frequency');
    let frequency;
    for (let i = 0; i < itemFrequency.length; i++) {
      if (itemFrequency[i].checked) {
        frequency = itemFrequency[i].value;
      }
    }

    const currentList = db.collection('lists').doc(token);
    currentList.update({
      items: firebase.firestore.FieldValue.arrayUnion({
        name: itemName.value,
        frequency: parseInt(frequency),
        lastPurchased: null,
      }),
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="item-name">Item Name: </label>
          <br />
          <input type="text" id="item-name" name="item-name" />
        </div>
        <div>
          <label htmlFor="item-frequency">
            How soon are you likely to buy again?
          </label>
          <br />
          <input
            type="radio"
            id="soon"
            name="item-frequency"
            value="7"
            defaultChecked
          />
          <label htmlFor="soon">Soon</label>
          <br />
          <input
            type="radio"
            id="kind-of-soon"
            name="item-frequency"
            value="14"
          />
          <label htmlFor="kind-of-soon">Kind of Soon</label>
          <br />
          <input type="radio" id="not-soon" name="item-frequency" value="30" />
          <label htmlFor="not-soon">Not Soon</label>
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
