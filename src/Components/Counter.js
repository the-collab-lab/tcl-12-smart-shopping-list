import React, { useState } from 'react';
import { db } from '../lib/firebase';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increaseCount = () => {
    setCount(count + 1);
    const newCount = db.collection('count').doc('FQyeXUHAfge9AXp6qXrK');
    newCount.update({ number: count + 1 });
  };

  return (
    <div>
      <p>The count is {count}!</p>
      <button onClick={increaseCount}>Click</button>
    </div>
  );
};

export default Counter;
