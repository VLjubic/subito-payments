import React from "react";
import { Link } from "react-router-dom";

function Navbar({ isLogedIn }) {
  return (
    isLogedIn && (
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">Subito Payments</h1>
          <div className="nav-links">
            <Link to="/overview">Overview</Link>
            <Link to="/addPayment">Add Payment</Link>
          </div>
        </div>
      </nav>
    )
  );
}

export default Navbar;
