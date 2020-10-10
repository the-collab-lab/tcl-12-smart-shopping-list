import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

const Counter = () => {
  const [count, setCount] = useState();
  const newCount = db.collection('count').doc('FQyeXUHAfge9AXp6qXrK');

  useEffect(() => {
    newCount
      .get()
      .then(function (doc) {
        setCount(doc.data().number);
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  }, [newCount]);

  const increaseCount = (newCount) => {
    newCount
      .update({ number: count + 1 })
      .then(() => {
        setCount(count + 1);
      })
      .catch((error) => {
        console.log('Error updating document:', error);
      });
  };

  return (
    <div>
      <p>The count is {count}!</p>
      <button onClick={() => increaseCount(newCount)}>Click</button>
    </div>
  );
};

export default Counter;
