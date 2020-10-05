import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './Home';
import List from './List';
import AddItem from './AddItem';
import NavBar from './NavBar/NavBar';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/add-item">
          <AddItem />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

      <NavBar />
    </Router>
  );
}
