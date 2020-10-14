import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import List from './List';
import AddItem from './AddItem';
import NavBar from './NavBar/NavBar';
import Button from './Button';
import { getListToken } from '../lib/tokens';

export default function Routes() {
  /*
  1. Route logic in this file
    - If no token, show button
  2. 
  */
  const generatedToken = getListToken();
  const [token, setToken] = useState(generatedToken);

  return (
    <Router>
      <Switch>
        <Route path="/add-item">
          <AddItem />
        </Route>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/">
          {generatedToken !== null ? (
            <Redirect to="/list" />
          ) : (
            <Button token={token} setToken={setToken} />
          )}
        </Route>
      </Switch>
      {generatedToken !== null && <NavBar />}
    </Router>
  );
}
