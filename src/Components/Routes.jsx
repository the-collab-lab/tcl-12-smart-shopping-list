import React from 'react';
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

export default function Routes() {
  /*
  1. Route logic in this file
    - If no token, show button
  2. 
  */

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
          {localStorage.getItem('token') !== null ? (
            <Redirect to="/list" />
          ) : (
            <Button />
          )}
        </Route>
      </Switch>
      {/* <Button hidden={hidden} setHidden={setHidden} /> */}
      {localStorage.getItem('token') !== null && <NavBar />}
    </Router>
  );
}
