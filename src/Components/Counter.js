import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

const Counter = () => {
  const [count, setCount] = useState();
  const newCount = db.collection('count').doc('FQyeXUHAfge9AXp6qXrK');

  useEffect(() => {
    const newCount = db.collection('count').doc('FQyeXUHAfge9AXp6qXrK');
    newCount.get().then(function (doc) {
      setCount(doc.data().number);
    });
  }, []);

  const increaseCount = (newCount) => {
    setCount(count + 1);
    newCount.update({ number: count + 1 });
  };

  return (
    <div>
      <p>The count is {count}!</p>
      <button onClick={() => increaseCount(newCount)}>Click</button>
    </div>
  );
};

export default Counter;
