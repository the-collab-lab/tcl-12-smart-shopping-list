import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import List from './List';
import AddItem from './AddItem';
import NavBar from './NavBar/NavBar';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/add-item">
          <AddItem />
        </Route>
        <Route path="/list">
          <List />
        </Route>
      </Switch>

      <NavBar />
    </Router>
  );
}
