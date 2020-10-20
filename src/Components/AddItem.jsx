import React from 'react';
import { db } from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { formatString } from '../lib/helpers.js';

export default function AddItem({ token }) {
  const { register, handleSubmit, reset, setError, errors } = useForm();

  const checkForDuplicateItem = async (currentList, itemName) => {
    await currentList.get().then((doc) => {
      const currentListData = doc.data();
      if (currentListData[itemName]) {
        return true;
      }
      return false;
    });
  };

  const updateFirestore = (currentList, itemName, formData) => {
    currentList
      .update({
        [itemName]: {
          name: formData.itemName,
          frequency: parseInt(formData.itemFrequency),
          lastPurchased: null,
        },
      })
      .then(() => {
        alert('Item has been submitted!');
        reset();
      });
  };

  const onSubmit = (data) => {
    const currentList = db.collection('lists').doc(token);
    const sanitizedName = formatString(data.itemName);

    if (checkForDuplicateItem(currentList, sanitizedName)) {
      setError('itemName', {
        type: 'duplicate',
        message: 'This item already exists in the list!',
      });
    } else {
      updateFirestore(currentList, sanitizedName, data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <br />
      <label htmlFor="itemName">Item Name: </label>
      <input
        id="itemName"
        name="itemName"
        defaultValue=""
        aria-invalid={errors.itemName ? 'true' : 'false'}
        ref={register({ required: true, minLength: 3 })}
      />
      <br />
      <span style={{ color: 'red' }}>
        {errors.itemName && errors.itemName.type === 'required' && (
          <span role="alert">Item name is required.</span>
        )}
        {errors.itemName && errors.itemName.type === 'minLength' && (
          <span role="alert">Minimum length is 3 characters</span>
        )}
        {errors.itemName && errors.itemName.type === 'duplicate' && (
          <span role="alert">{errors.itemName.message}</span>
        )}
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
