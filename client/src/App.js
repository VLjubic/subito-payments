import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Overview from "./pages/Overview";
import TestOverview2 from "./Pages/TestOverview2";
import AddPayment from "./pages/AddPayment";
import "./index.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/addPayment" element={<AddPayment />} />
          <Route path="/pre" element={<TestOverview2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
