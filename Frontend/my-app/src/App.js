import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';

const App = () => {
  return (
    <div className="App">

      <BrowserRouter>
          <Navbar/>
      </BrowserRouter>
     
    </div>
  );
}

export default App;
