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
  const [token, setToken] = useState(getListToken());

  return (
    <Router>
      <Switch>
        <Route path="/add-item">
          <AddItem token={token} />
        </Route>
        <Route path="/list">
          <List token={token} />
        </Route>
        <Route path="/">
          {token !== null ? (
            <Redirect to="/list" />
          ) : (
            <Button token={token} setToken={setToken} />
          )}
        </Route>
      </Switch>
      {token !== null && <NavBar />}
    </Router>
  );
}
