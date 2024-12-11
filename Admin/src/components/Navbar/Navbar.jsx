import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [navActive, setNavActive] = useState(false);

    const handleNavToggle = () => {
        setNavActive(!navActive);
      };
  return (
    <div className='admin-navbar'>
      <header>
        <nav className={navActive ? 'nav-active' : ''}>
            {/* <Link to='/' className="active">Home</Link>
            <Link to='/election'>Election</Link>
            <Link to='/users'>Users</Link>
            <Link to='/results'>Results</Link>
            <Link to='/review'>Review</Link>
            <Link to='/party'>Party</Link> */}
        </nav>
        <div className="hamburger" onClick={handleNavToggle}>
          &#9776;
        </div>
      </header>
    </div>
  )
}

export default Navbar;
