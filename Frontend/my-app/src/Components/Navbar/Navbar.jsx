// Navbar.js (Commit 2)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Navbar.css';
import logo from '../Assests/ElectS.png';

const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('user-name');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleNavToggle = () => {
    setNavActive(!navActive);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-id');
        localStorage.removeItem('user-name');
        setUserName('');
        window.location.replace('/');
      }
    });
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

          {localStorage.getItem('auth-token') ? (
            <>
              <Link onClick={handleLogout} className="tooltip-container-logout" data-tooltip="Logout">Logout</Link>
              <div className="welcome-message">{userName}</div>
            </>
          ) : (
            <Link to='/login' className="tooltip-container" data-tooltip="Login">Login</Link>
          )}
        </nav>
        <div className="hamburger" onClick={handleNavToggle}>
          &#9776;
        </div>
      </header>
    </div>
  );
};

export default Navbar;
