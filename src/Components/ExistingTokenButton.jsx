/*
NOTES:

What Works:
- Create new token (broke when we moved to Home but is fixed)
- If token doesn't exist, proper pop up shows up
- If token exists, it saves to localStorage
- With token, /list shows correct list
-history.push redirects

What Doesn't Work:
- Empty string breaks app. Catch error code not working or an else if or .empty

Fixed/ Answered:
- history.push not working for redirect and I have no clue why (having to refresh to see list contents)
  - Update: Needed a useState to refresh browser
- Idk if important, but specifically 'test-token' breaks code, even on production (use 'rev vast petty' for example token)
  - Update: test-token isn't an array in firestore. Others work


*/

import React, { useState } from 'react';
//import getListToken, { generateListToken } from "../lib/tokens";
import { db } from '../lib/firebase';
import { useHistory } from 'react-router-dom';

export default function ExistingTokenButton({ setToken }) {
  const [input, setInput] = useState('');

  let history = useHistory();

  const handleClick = (event) => {
    event.preventDefault(); //works. needed for onChange and onClick to work
    //const trimmed_input = input.trim();

    db.collection('lists')
      .doc(input)
      .onSnapshot(function (querySnapshot) {
        if (querySnapshot.exists) {
          //alert(input); //works

          localStorage.setItem('token', input); //works
          // localStorage.getItem('token');
          setToken(input);
          history.push('/list'); //DOESN'T WORK *******
        } else {
          alert('Shopping list does not exist. Try again or get a new token'); //works
        }
      });
  };

  return (
    <div>
      <form>
        <label>Join an existing list:</label>
        <input
          label="Enter Token"
          id="join-list"
          defaultValue=""
          onChange={(event) => setInput(event.target.value)} //works. needed to work onClick
        ></input>
        <button type="submit" onClick={handleClick}>
          Join List
        </button>{' '}
        {/*works*/}
      </form>
    </div>
  );
}
