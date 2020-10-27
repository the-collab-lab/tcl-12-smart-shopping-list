import React from 'react';
import { db } from '../lib/firebase';
import { formatString } from '../lib/helpers.js';

export default function List({ items, token }) {
  // function check(){
  //   if(document.querySelectorAll("#checked").is(":checked")){
  //     document.querySelectorAll
  //   }
  // }

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
    // .then(() => {
    //   alert('Item has been submitted!');
    //   reset();
    // })
    // .catch((e) => {
    //   console.log('Error updating Firestore: ', e);
    //   alert(
    //     `It isn't you, it's us. The item cannot be submitted at this time. Try again later while we look into it.`,
    //   );
    // });
  };

  return (
    <div className="List">
      <h3>Item List:</h3>
      <ul>
        {items.map((item) => (
          <div>
            <input
              type="checkbox"
              class="checked"
              onClick={() => purchaseItem(item)}
            />
            <label>{item.name}</label>
          </div>
        ))}
      </ul>
    </div>
  );
}
