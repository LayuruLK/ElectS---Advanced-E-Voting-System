import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <div className="App">

      <BrowserRouter>
          <Navbar/>

          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginSignup/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/candidates' element={<Candidates/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/elections' element={<Election/>}/>
            <Route path="/election/:id" element={<ElectionDetails/>}/>
            <Route path="/complaint-form/:id" element={<ComplaintForm/>}/> 
            <Route path="/edit-users/:id" element={<EditProfileUser/>}/>
            <Route path="/edit-candidates" element={<EditProfileCandidate/>}/>
            <Route path="/candidates/personal/:id" element={<EditPersonalCandidate/>}/>
            <Route path='/candidates/add-projects' element={<AddProjectCandidate/>}/>
            <Route path="/candidates/edit-projects/:id" element={<Projects/>}/>
            <Route path="/edit-project/:id" element={<EditProject/>}/>
            <Route path="/candidate/:id" element={<CandidateProfile/>}/>
            <Route path='/results' element={<Results/>}/>
          </Routes> 

          
      </BrowserRouter>
          <Footer/>
    </div>
  );
}

export default App;
