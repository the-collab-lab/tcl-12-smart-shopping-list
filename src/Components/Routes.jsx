import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import List from './List';
import AddItem from './AddItem';
import NavBar from './NavBar/NavBar';
import Button from './Button';

export default function Routes() {
  const [hidden, setHidden] = useState(false);

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
      <Button hidden={hidden} setHidden={setHidden} />
      <NavBar />
    </Router>
  );
}
