import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // For navigation after logout

  const handleNavToggle = () => {
    setNavActive(!navActive);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Optionally navigate to homepage or login page
    navigate('/login');
  };

  return (
    <div className='admin-navbar'>
      <header>
        <nav className={navActive ? 'nav-active' : ''}>
          <Link to='/' className="active">Home</Link>
          <Link to='/election'>Election</Link>
          <Link to='/users'>Users</Link>
          
          <Link to='/review'>Review</Link>
          <Link to='/party'>Party</Link>
          {token ? (
            <Link to='/login' className='admin-login' onClick={handleLogout}>Logout</Link>
          ) : (
            <Link to='/login' className='admin-login'>Login</Link>
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
