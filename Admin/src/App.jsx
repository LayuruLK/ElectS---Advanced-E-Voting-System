import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div>
    <Navbar/>
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
