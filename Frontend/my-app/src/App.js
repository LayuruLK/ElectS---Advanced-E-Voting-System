import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import LoginSignup from './Pages/LoginSignup';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Footer from './Components/Footer/Footer';
import Candidates from './Components/Candidates/Candidates';

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
          </Routes> 

          
      </BrowserRouter>
          <Footer/>
    </div>
  );
}

export default App;
