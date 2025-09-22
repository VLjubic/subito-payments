import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Company from "./Pages/Company";

import Login from "./Pages/Login";
import "./index.css";
import "./App.css";
import Genius from "./Pages/Genius";
import Home from "./Pages/Home";

function App() {
  const [logedIn, setLogedIn] = useState(false);
  return (
    <Router>
      <Navbar logedIn={logedIn} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login setLogedIn={setLogedIn} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gov" element={<Company />} />
          <Route path="/genius" element={<Genius />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
