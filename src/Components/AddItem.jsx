import React from 'react';

export default function AddItem() {
  return (
    <div>
      <form>
        <div>
          <label htmlFor="item-name">Item Name: </label>
          <br />
          <input type="text" name="item-name" />
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
      </form>
      <input type="submit" value="submit" />
    </div>
  );
}
