import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Company from "./Pages/Company";
import Login from "./Pages/Login";
import Genius from "./Pages/Genius";
import Home from "./Pages/Home";
import PrivateRoute from "./Components/PrivateRoute";
import "./App.css";
import "./index.css";

function App() {
  const [logedIn, setLogedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/verifyToken", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setLogedIn(true);
        } else {
          localStorage.removeItem("token");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>; // optional loading state

  return (
    <Router>
      <Navbar logedIn={logedIn} />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<Login logedIn={logedIn} setLogedIn={setLogedIn} />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute logedIn={logedIn}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/gov"
            element={
              <PrivateRoute logedIn={logedIn}>
                <Company />
              </PrivateRoute>
            }
          />
          <Route
            path="/genius"
            element={
              <PrivateRoute logedIn={logedIn}>
                <Genius />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
