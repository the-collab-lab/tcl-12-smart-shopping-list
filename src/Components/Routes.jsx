import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import FirestoreList from './FirestoreList';
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
          <FirestoreList />
        </Route>
      </Switch>

      <NavBar />
    </Router>
  );
}
