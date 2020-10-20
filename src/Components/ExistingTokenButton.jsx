/*
NOTES:

What Works:
- Create new token (broke when we moved to Home but is fixed)
- If token doesn't exist, proper pop up shows up
- If token exists, it saves to localStorage
- With token, /list shows correct list

Fixed/ Answered:
- history.push not working for redirect and I have no clue why (having to refresh to see list contents)
  - Update: Needed a useState to refresh browser
- Idk if important, but specifically 'test-token' breaks code, even on production (use 'rev vast petty' for example token)
  - Update: test-token isn't an array in firestore. Others work

What Doesn't Work:
- Empty string breaks app. Catch error code not working or an else if or .empty
  - TRIED
    input === ""
    input === null
    input === undefined
    input === "" || input === null || input === undefined
    querySnapshot === ""
    querySnapshot === null
    
    input.empty
    querySnapshot.empty
    
    .catch((error) => {
            console.log('Error updating document:', error);
          });

    {errors.EnterToken && "Enter valid token"}


*/

import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function ExistingTokenButton({ setToken }) {
  const [input, setInput] = useState('');
  let history = useHistory();
  const { register } = useForm();

  const handleClick = (event) => {
    event.preventDefault();
    if (input === '') {
      alert('Enter a valid token');
    } else {
      db.collection('lists')
        .doc(input)
        .onSnapshot(function (querySnapshot) {
          if (querySnapshot.exists) {
            localStorage.setItem('token', input);
            setToken(input);
            history.push('/list');
          } else {
            alert('Shopping list does not exist. Try again or get a new token');
          }
        });
    }
  };

  return (
    <div className="token">
      <form>
        {/* <label htmlFor="joinList"><p>Join an existing list:</p></label> */}

        <input
          label="Enter Token"
          name="EnterToken"
          id="joinList"
          type="text"
          placeholder="Three word token"
          defaultValue=""
          aria-label="Enter three word token"
          aria-required="true"
          onChange={(event) => setInput(event.target.value)}
          ref={register}
        ></input>
        <br />
        <button type="submit" onClick={handleClick}>
          Join an existing list
        </button>
      </form>
    </div>
  );
}
