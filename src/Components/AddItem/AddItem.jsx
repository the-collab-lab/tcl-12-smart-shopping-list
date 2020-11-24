import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatString } from '../../lib/helpers.js';
import { checkForDuplicateItem, addItem } from '../../services/listService';
import '../../styles/Input.css';
import './AddItem.css';

import CustomModal from '../CustomModal';

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
    <div className="AddItem">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="itemName" className="itemName">
          Item Name:{' '}
        </label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          placeholder="Ex: Apples"
          defaultValue=""
          aria-invalid={errors.itemName ? 'true' : 'false'}
          ref={register({ required: true, minLength: 3 })}
        />
        <span className="errorMessage">
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
        <fieldset>
          <legend>How soon are you likely to buy again?</legend>
          <div className="radioButtons">
            <label htmlFor="soon">
              <input
                type="radio"
                id="soon"
                name="itemFrequency"
                ref={register}
                defaultValue="7"
                defaultChecked
              />
              Soon (7 days)
            </label>
            <label htmlFor="kind-of-soon">
              <input
                type="radio"
                id="kind-of-soon"
                name="itemFrequency"
                ref={register}
                defaultValue="14"
              />
              Kind of Soon (14 days)
            </label>
            <label htmlFor="not-soon">
              <input
                type="radio"
                id="not-soon"
                name="itemFrequency"
                ref={register}
                defaultValue="30"
              />
              Not Soon (30 days)
            </label>
          </div>
        </fieldset>
        <input
          className="Button submit"
          type="submit"
          value="Submit"
          name="submit"
          ref={register}
        />
      </form>
      <CustomModal
        modalMessage={modalMessage}
        modalIsOpen={modalIsOpen}
        closeFunction={() => setModalIsOpen(false)}
      />
    </div>
  );
}
