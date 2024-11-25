import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assests/ElectS.png';

const Navbar = () => {
  const [navActive, setNavActive] = useState(false);

  const handleNavToggle = () => {
    setNavActive(!navActive);
  };

  return (
    <div className='navbar'>
      <header>
        <img className="logo-img" src={logo} alt="Logo" />
        <nav className={navActive ? 'nav-active' : ''}>
          <Link to='/' className="active">Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/elections'>Elections</Link>
          <Link to='/results'>Results</Link>
          <Link to='/contact'>Contact</Link>
        </nav>
        <div className="hamburger" onClick={handleNavToggle}>
          &#9776;
        </div>
      </header>
    </div>
  );
};

export default Navbar;
