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
            <Route path="/complaint-form/:id" element={<ComplaintForm/>}/> 
            <Route path="/edit-users/:id" element={<EditProfileUser/>}/>
          </Routes> 

          
      </BrowserRouter>
          <Footer/>
    </div>
  );
}

export default App;
