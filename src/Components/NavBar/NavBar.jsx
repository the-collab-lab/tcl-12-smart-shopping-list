import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <div>
      <nav className="NavBar">
        <NavLink className="Button" to="/list" activeClassName="nav-selected">
          List <i class="fas fa-list-ul" aria-hidden="true"></i>
        </NavLink>

        <NavLink
          className="Button"
          to="/add-item"
          activeClassName="nav-selected"
        >
          Add an Item <i class="fas fa-plus" aria-hidden="true"></i>
        </NavLink>
      </nav>
    </div>
  );
}
