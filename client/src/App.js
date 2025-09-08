import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Overview from "./pages/Overview";
import AddPayment from "./Pages/AddPayment";
import Login from "./Pages/Login";
import "./index.css";

function App() {
  const [logedIn, setLogedIn] = useState(false);
  return (
    <Router>
      <Navbar logedIn={logedIn} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login setLogedIn={setLogedIn} />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/addPayment" element={<AddPayment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
