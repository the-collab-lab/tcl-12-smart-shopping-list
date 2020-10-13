import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <div>
      {localStorage.getItem('token') === null ? null : (
        <nav className="NavBar">
          <NavLink to="/list" activeClassName="nav-selected">
            List
          </NavLink>

          <NavLink to="/add-item" activeClassName="nav-selected">
            Add an Item
          </NavLink>
        </nav>
      )}
    </div>
  );
}
