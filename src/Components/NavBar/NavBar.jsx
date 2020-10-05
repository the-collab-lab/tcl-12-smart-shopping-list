import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

/**
 * NavBar component for the app
 */
export default function NavBar() {
  return (
    <ul className="NavBar">
      <li>
        <NavLink exact to="/" activeClassName="nav-selected">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink exact to="/list" activeClassName="nav-selected">
          List
        </NavLink>
      </li>
      <li>
        <NavLink exact to="/add-item" activeClassName="nav-selected">
          Add an Item
        </NavLink>
      </li>
    </ul>
  );
}
