import React from 'react';
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom';
import Home from './Home';
import List from './List';
import AddItem from './AddItem';

export default function Routes() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/list">List</Link>
          </li>
          <li>
            <Link to="/add-item">Add an Item</Link>
          </li>
        </ul>
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
      </div>
    </Router>
  );
}
