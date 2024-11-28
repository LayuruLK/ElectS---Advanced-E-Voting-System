import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
//import './Navbar.css';
import logo from '../Assests/ElectS.png';


const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const userId = localStorage.getItem('user-id');
  const [userName, setUserName] = useState('');
  const [userProfilePhoto, setUserProfilePhoto] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('user-name');
    if (name) {
      setUserName(name);
    }
  }, []);


  useEffect(() => {
    // Fetch user profile photo
    const fetchUserProfilePhoto = async () => {
      const token = localStorage.getItem('auth-token');

      try {
        const response = await fetch(`http://localhost:5000/api/v1/users/profile/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const user = await response.json();
          
          setUserProfilePhoto(user.profilePhoto);
        } else {
          console.error('Failed to fetch user profile photo');
        }
      } catch (error) {
        console.error('Error fetching user profile photo:', error);
      }
    };
    if (userId) {
      fetchUserProfilePhoto();
    }
  }, [userId]);


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
        <img className="logo-img" src={logo} alt="" />
        <nav className={navActive ? 'nav-active' : ''}>
          <Link to='/' className="active">Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/elections'>Elections</Link>
          <Link to='/results'>Results</Link>
          <Link to='/contact'>Contact</Link>

          {localStorage.getItem('auth-token') ? (
            <>
           <Link onClick={handleLogout} className="tooltip-container-logout" data-tooltip="Logout">Logout</Link>

              <div className="welcome-message">
                {userProfilePhoto && <img src={`http://localhost:5000/${userProfilePhoto}`} alt="Profile" />}
                {userName}
                <div className="green-dot"></div>
              </div>
           
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
}

export default Navbar;
