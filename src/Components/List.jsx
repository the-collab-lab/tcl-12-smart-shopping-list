import React from 'react';

export default function List({ items }) {
  return (
    <div className="List">
      <h3>Item List:</h3>
      <ul>
        {items.map((item) => (
          <li>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
