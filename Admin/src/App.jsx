import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from "./components/Login";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div>
     <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/> 
        <Route path="/login" element={<Login/>}/>
      </Routes>
     </BrowserRouter>
    
    </div>
  );
}

export default App;
