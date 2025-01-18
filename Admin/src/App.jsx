import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import ElectionSideBar from './components/ElectionSideBar/ElectionSideBar';
import Review from './components/Review/Review';
import ElectionList from './components/ElectionList/ElectionList';
import UpdateElection from './components/UpdateElection/UpdateElection';
import AddElection from './components/AddElection/AddElection';
import NICReview from './components/NICReview/NICReview';
import ProjectReview from './components/ProjectReview/ProjectReview';
import ComplaintReview from './components/ComplaintReview/ComplaintReview';
import Party from './components/Party/Party';
import UpdateParty from './components/UpdateParty/UpdateParty';
import AddParty from './components/AddParty/AddParty';
import PartyList from './components/PartyList/PartyList';
import CandidateReview from './components/CandidateReview/CandidateReview';
import CandidateProfile from './components/CandidateProfile/CandidateProfile';
import Projects from './components/Projects/Projects';
import Complaints from './components/Complaints/Complaints';
import HomeSideBar from './components/HomeSideBar/HomeSideBar';
import Login from "./components/Login/Login";
import AdminRegister from './components/Register/Register';
//import PresidentialElection from './components/Elections/PresidentialElection/PresidentialElection';
//import ParlimentElection from './components/Elections/ParlimentElection/ParlimentElection';
//import ProvincialElection from './components/Elections/ProvincialElection/ProvincialElection';
//import GeneralElection from './components/Elections/GeneralElection/GeneralElection';
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <div>
      <Navbar/>
      <div className='homesidebar'>
        <HomeSideBar/>
      </div>
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<Home/>}/>

          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<AdminRegister />} />

          <Route path='/projects' element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>} />
          <Route path='/complaints' element={
            <ProtectedRoute>
              <Complaints />
              </ProtectedRoute>} />

          <Route path='/election' element={<ElectionSideBar/>}/>        
          <Route path='/election-list' element={<ElectionList/>}/>
          <Route path='/update-election' element={<UpdateElection/>}/>
          
          <Route path='/add-election' element={<AddElection/>}/>
          {/* <Route path='/presidential-election' element={<PresidentialElection/>}/>
          <Route path='/parliment-election' element={<ParlimentElection/>}/>
          <Route path='/provincial-election' element={<ProvincialElection/>}/>
          <Route path='/general-election' element={<GeneralElection/>}/>
         */}
          <Route path='/review' element={<Review/>}/>
          <Route path='/nic-review' element={<NICReview/>}/>
          <Route path='/project-review' element={<ProjectReview/>}/>
          <Route path='/complaint-review' element={<ComplaintReview/>}/>
          <Route path='/candidate-review' element={<CandidateReview/>}/>
          <Route path='/candidate-profile/:id' element={<CandidateProfile/>}/>

          <Route path='/party' element={<Party/>}/>
          <Route path='/party-list' element={<PartyList/>}/>
          <Route path='/update-party' element={<UpdateParty/>}/>
          <Route path='/add-party' element={<AddParty/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
