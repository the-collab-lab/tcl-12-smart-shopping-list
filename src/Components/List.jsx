import React from 'react';

export default function List({ items }) {
  return (
    <div className="List">
      <ul>
        {items.map((item) => (
          <li>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
