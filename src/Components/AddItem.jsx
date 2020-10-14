import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from 'firebase';
import { db } from '../lib/firebase';

export default function AddItem() {
  const [token, setToken] = useState('test-token');
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = (data) => {
    const currentList = db.collection('lists').doc(token);
    currentList
      .update({
        items: firebase.firestore.FieldValue.arrayUnion({
          name: data.itemName,
          frequency: parseInt(data.itemFrequency),
          lastPurchased: null,
        }),
      })
      .then(() => alert('Item has been submitted!'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <br />
      <label htmlFor="itemName">Item Name: </label>
      <input
        name="itemName"
        defaultValue=""
        ref={register({ required: true, minLength: 3 })}
      />
      <br />
      <span style={{ color: 'red' }}>
        {errors.itemName && ' Item name is required.'}
      </span>
      <br />
      <br />
      <div>
        <label htmlFor="itemFrequency">
          How soon are you likely to buy again?
        </label>
        <br />
        <br />
        <input
          type="radio"
          id="soon"
          name="itemFrequency"
          ref={register}
          defaultValue="7"
          defaultChecked
        />
        <label htmlFor="soon">Soon</label>
        <br />
        <input
          type="radio"
          id="kind-of-soon"
          name="itemFrequency"
          ref={register}
          defaultValue="14"
        />
        <label htmlFor="kind-of-soon">Kind of Soon</label>
        <br />
        <input
          type="radio"
          id="not-soon"
          name="itemFrequency"
          ref={register}
          defaultValue="30"
        />
        <label htmlFor="not-soon">Not Soon</label>
      </div>
      <br />
      <input type="submit" defaultValue="Submit" ref={register} />
      <br />
    </form>
  );
}
