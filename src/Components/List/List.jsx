import React from 'react';
import { useHistory } from 'react-router-dom';
import './List.css';

export default function List({ items }) {
  let history = useHistory();

  const redirectPath = () => {
    history.push('/add-item');
  };

  return (
    <div className="List">
      {items.length === 0 ? (
        <section className="listContainer emptyList">
          <h3>
            Your shopping list is empty. Add a new item to start your list.
          </h3>
          <button onClick={redirectPath}>Add New Item</button>
        </section>
      ) : (
        <section className="listContainer">
          <h3>Item List:</h3>

          <ul>
            {items.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
