import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

/**
 * NavBar component for the app
 */
export default function NavBar() {
  return (
    <nav className="NavBar">
      <NavLink exact to="/" activeClassName="nav-selected">
        Home
      </NavLink>

      <NavLink exact to="/list" activeClassName="nav-selected">
        List
      </NavLink>

      <NavLink exact to="/add-item" activeClassName="nav-selected">
        Add an Item
      </NavLink>
    </nav>
  );
}
