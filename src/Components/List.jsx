import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

// TODO: Read list from firestore and display list items

export default function List() {
  const [token, setToken] = useState('test-token');
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    // Retrieve item list from Firestore
    db.collection('lists')
      .doc(token)
      .get()
      .then((doc) => {
        setItemList(doc.data().items);
      });
  }, []);

  return (
    <div>
      <ul>
        {itemList.map((item) => {
          return <li key={item.name}>{item.name}</li>;
        })}
      </ul>
    </div>
  );
}
