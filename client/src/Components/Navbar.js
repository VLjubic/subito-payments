import React from "react";
import { Link } from "react-router-dom";

function Navbar({ logedIn }) {
  return (
    logedIn && (
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">Subito Payments</h1>
          <div className="nav-links">
            <Link to="/home">Home</Link>
            <Link to="/gov">Obrt</Link>
            <Link to="/genius">Genius</Link>
            <button
              className="btn logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    )
  );
}

export default Navbar;
