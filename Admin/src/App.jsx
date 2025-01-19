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
import ParlimentElection from './components/Elections/ParlimentElection/ParlimentElection';
import ProvincialElection from './components/Elections/ProvincialElection/ProvincialElection';
//import GeneralElection from './components/Elections/GeneralElection/GeneralElection';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <div>
      <Navbar />
      <div className='homesidebar'>
        <HomeSideBar />
      </div>
      <div className='main-content'>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<AdminRegister />} />

            <Route path='/projects' element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>} />
            <Route path='/complaints' element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>} />

            <Route path='/election' element={
              <ProtectedRoute>
                <ElectionSideBar />
              </ProtectedRoute>} />
            <Route path='/election-list' element={
              <ProtectedRoute>
                <ElectionList />
              </ProtectedRoute>} />
            <Route path='/update-election' element={
              <ProtectedRoute>
                <UpdateElection />
              </ProtectedRoute>} />

            <Route path='/add-election' element={
              <ProtectedRoute>
                <AddElection />
              </ProtectedRoute>} />
            {/* <Route path='/presidential-election' element={<PresidentialElection/>}/> */}
            <Route path='/parliment-election' element={
              <ProtectedRoute>
                <ParlimentElection />
              </ProtectedRoute>} />
            <Route path='/provincial-election' element={
              <ProtectedRoute>
                <ProvincialElection />
              </ProtectedRoute>} />
            {/* <Route path='/general-election' element={<GeneralElection/>}/> */}

            <Route path='/review' element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>} />
            <Route path='/nic-review' element={
              <ProtectedRoute>
                <NICReview />
              </ProtectedRoute>} />
            <Route path='/project-review' element={
              <ProtectedRoute>
                <ProjectReview />
              </ProtectedRoute>} />
            <Route path='/complaint-review' element={
              <ProtectedRoute>
                <ComplaintReview />
              </ProtectedRoute>} />
            <Route path='/candidate-review' element={
              <ProtectedRoute>
                <CandidateReview />
              </ProtectedRoute>} />
            <Route path='/candidate-profile/:id' element={
              <ProtectedRoute>
                <CandidateProfile />
              </ProtectedRoute>} />

            <Route path='/party' element={
              <ProtectedRoute>
                <Party />
              </ProtectedRoute>} />
            <Route path='/party-list' element={
              <ProtectedRoute>
                <PartyList />
              </ProtectedRoute>} />
            <Route path='/update-party' element={
              <ProtectedRoute>
                <UpdateParty />
              </ProtectedRoute>} />
            <Route path='/add-party' element={
              <ProtectedRoute>
                <AddParty />
              </ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </div>
    </div>
  )
}

export default App
