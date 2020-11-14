import React from 'react';
import { db } from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { formatString } from '../lib/helpers.js';
import { checkForDuplicateItem, addItem } from '../services/listService';

export default function AddItem({ token }) {
  const { register, handleSubmit, reset, setError, errors } = useForm();

  const onSubmit = async (data) => {
    const sanitizedName = formatString(data.itemName);

    try {
      const duplicateItem = await checkForDuplicateItem(token, sanitizedName);

      if (duplicateItem) {
        setError('itemName', {
          type: 'duplicate',
          message: 'This item already exists in the list!',
        });
      } else {
        await addItem(token, sanitizedName, data);
        reset();
      }
    } catch (e) {
      console.log('Error checking for duplicate item: ', e);
      alert(
        `It isn't you, it's us. The item cannot be submitted at this time. Try again later while we look into it.`,
      );
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
      <fieldset>
        <legend>How soon are you likely to buy again?</legend>
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
        <label htmlFor="soon">Soon (7 days)</label>
        <br />
        <input
          type="radio"
          id="kind-of-soon"
          name="itemFrequency"
          ref={register}
          defaultValue="14"
        />
        <label htmlFor="kind-of-soon">Kind of Soon (14 days)</label>
        <br />
        <input
          type="radio"
          id="not-soon"
          name="itemFrequency"
          ref={register}
          defaultValue="30"
        />
        <label htmlFor="not-soon">Not Soon (30 days)</label>
      </fieldset>
      <br />
      <input type="submit" defaultValue="Submit" ref={register} />
      <br />
    </form>
  );
}
