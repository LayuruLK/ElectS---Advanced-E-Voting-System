import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Review from "./components/Review/Review";
import NICReview from "./components/NICReview/NICReview";
import CandidateReview from "./components/CandidateReview/CandidateReview";
import CandidateProfile from "./components/CandidateProfile/CandidateProfile";
import Party from './components/Party/Party';
import AddParty from './components/AddParty/AddParty';
import AdminRegister from './components/Register/Register';
import { AuthProvider } from "./context/AuthContext";
import ElectionSideBar from "./components/ElectionSideBar/ElectionSideBar";
import AddElection from "./components/AddElection/AddElection";
import ComplaintReview from "./components/ComplaintReview/ComplaintReview";
import HomeSideBar from "./components/HomeSideBar/HomeSideBar";


function App() {
  return (
    <AuthProvider>
    <div>
     <BrowserRouter>
      <Navbar/>
      <div className='homesidebar'>
        <HomeSideBar/>
      </div>
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<Home/>}/>

          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<AdminRegister />} />

          <Route path='/review' element={<Review/>}/>
          <Route path='/nic-review' element={<NICReview/>}/>
          <Route path="/complaint-review" element={<ComplaintReview/>}/>
          <Route path='/candidate-review' element={<CandidateReview/>}/>
          <Route path='/candidate-profile/:id' element={<CandidateProfile/>}/>
          
          <Route path='/party' element={<Party/>}/>
          <Route path='/add-party' element={<AddParty/>}/>
      
          <Route path="/election" element={<ElectionSideBar/>}/>
          <Route path="/add-election" element={<AddElection/>}/>
          
        </Routes>
      </div>
     </BrowserRouter>
    
    </div>
    </AuthProvider>
  );
}

export default App;
