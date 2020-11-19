import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatString } from '../lib/helpers.js';
import { checkForDuplicateItem, addItem } from '../services/listService';

import CustomModal from './CustomModal';

export default function AddItem({ token }) {
  const { register, handleSubmit, reset, setError, errors } = useForm();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('test message');

  function setAlert(message) {
    setModalMessage(message);
    setModalIsOpen(true);
  }

  const onSubmit = async (data) => {
    const sanitizedName = formatString(data.itemName);

    try {
      const duplicateItem = await checkForDuplicateItem(token, sanitizedName);

      if (duplicateItem) {
        setError('itemName', {
          type: 'duplicate',
          message: `"${data.itemName}" already exists in the list!`,
        });
      } else {
        const successfulAdd = await addItem(token, sanitizedName, data);

        if (successfulAdd) {
          setAlert(`"${data.itemName}" has been successfully added!`);
        } else {
          setAlert(
            `It isn't you, it's us. The item cannot be submitted at this time. Try again later while we look into it.`,
          );
        }

        reset();
      }
    } catch (e) {
      console.log('Error checking for duplicate item: ', e);
      setAlert(
        `It isn't you, it's us. The item cannot be submitted at this time. Try again later while we look into it.`,
      );
    }
  };

  return (
    <div>
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
        <input type="submit" value="Submit" name="submit" ref={register} />
        <br />
      </form>
      <CustomModal
        modalMessage={modalMessage}
        modalIsOpen={modalIsOpen}
        closeFunction={() => setModalIsOpen(false)}
      />
    </div>
  );
}
