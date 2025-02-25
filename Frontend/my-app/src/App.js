import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FaUserEdit, FaSignOutAlt, FaTrashAlt, FaCaretDown, FaMoon, FaSun } from 'react-icons/fa';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import LoginSignup from './Pages/LoginSignup';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Footer from './Components/Footer/Footer';
import Candidates from './Components/Candidates/Candidates';
import Contact from './Components/Contact/Contact';
import About from './Components/About/About';
import Election from './Components/Election/Election';
import ComplaintForm from './Components/ComplaintForm/ComplaintForm';
import EditProfileUser from "./Components/EditProfileUser/EditProfileUser";
import EditProfileCandidate from "./Components/EditProfileCandidate/EditProfileCandidate";
import EditPersonalCandidate from "./Components/EditPersonalCandidate/EditPersonalCandidate";
import AddProjectCandidate from './Components/AddProjectCandidate/AddProjectCandidate';
import Results from './Components/Results/Results';
import ElectionDetails from './Components/ElectionDetails/ElectionDetails';
import CandidateProfile from "./Components/CandidateProfile/CandidateProfile";
import EditProject from "./Components/EditProject/EditProject";
import Projects from "./Components/Projects/Projects";
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import SetPassword from './Components/SetPassword/SetPassword';
import ElectionDetailsParlimentary from "./Components/ElectionDetailsParlimentary/ElectionDetailsParlimentary";
import ElectionDetailsPresidential from "./Components/ElectionDetailsPresidential/ElectionDetailsPresidential";
import ElectionDetailsProvincial from "./Components/ElectionDetailsProvincial/ElectionDetailsProvincial";
import FiledComplaints from "./Components/FiledComplaints/FiledComplaints";
import ComplaintList from "./Components/ComplaintList/ComplaintList";
import ReportFake from "./Components/ReportFake/ReportFake";
import CandidateDescription from "./Components/CandidateDescription/CandidateDescription";
import { useTheme } from './Context/ThemeContext';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/setpassword" element={<SetPassword />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/elections' element={<Election />} />
          <Route path='/candidates' element={<Candidates />} />
          <Route path="/edit-candidates" element={<EditProfileCandidate />} />
          <Route path="/edit-users/:id" element={<EditProfileUser />} />
          <Route path="/candidates/personal/:id" element={<EditPersonalCandidate />} />
          <Route path='/candidates/add-projects' element={<AddProjectCandidate />} />

          <Route path="/election/:id" element={<ElectionDetails />} />
          <Route path="/presidential-election/:id" element={<ElectionDetailsPresidential/>}/>
          <Route path="/parlimentary-election/:id" element={<ElectionDetailsParlimentary/>}/>
          <Route path="/provincial-election/:id" element={<ElectionDetailsProvincial/>}/>

          <Route path="/filed-complaints/:id" element={<FiledComplaints/>}/>
          <Route path="/complaints" element={<ComplaintList/>}/>
          <Route path="/report/:id" element={<ReportFake/>}/>

          <Route path="/candidate/:id" element={<CandidateProfile />} />
          <Route path="/description" element={<CandidateDescription/>}/>
          <Route path="/candidates/edit-projects/:id" element={<Projects />} />
          <Route path="/edit-project/:id" element={<EditProject />} />
          <Route path="/complaint-form/:id" element={<ComplaintForm />} />
          <Route path='/results' element={<Results />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default App;
