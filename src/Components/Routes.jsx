import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import FirestoreList from './FirestoreList';
import AddItem from './AddItem/AddItem.jsx';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import { getListToken } from '../lib/tokens';

export default function Routes() {
  const [token, setToken] = useState(getListToken());

  return (
    <Router>
      <Switch>
        <Route path="/add-item">
          {token === null ? <Redirect to="/" /> : <AddItem token={token} />}
        </Route>
        <Route path="/list">
          {token === null ? (
            <Redirect to="/" />
          ) : (
            <FirestoreList token={token} />
          )}
        </Route>
        <Route path="/">
          {token !== null ? (
            <Redirect to="/list" />
          ) : (
            <Home setToken={setToken} />
          )}
        </Route>
      </Switch>
      {token !== null && <NavBar />}
    </Router>
  );
}
