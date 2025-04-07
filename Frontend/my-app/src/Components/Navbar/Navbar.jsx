import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Navbar.css';
import logo from '../Assests/logo.png';
import { FaUserEdit, FaSignOutAlt, FaTrashAlt, FaCaretDown, FaMoon, FaSun, FaCheckCircle, FaFileAlt, FaUser, FaExclamationCircle } from 'react-icons/fa';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Navbar = () => {
  const location = useLocation(); // Get current route path
  const [navActive, setNavActive] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);
  const userId = localStorage.getItem('user-id');
  const [userName, setUserName] = useState('');
  const [userProfilePhoto, setUserProfilePhoto] = useState('');
  const { theme, toggleTheme } = useTheme();  // Getting theme and toggleTheme from context
  const isCandidate = localStorage.getItem('user-isCandidate') === 'true';

  useEffect(() => {
    const name = localStorage.getItem('user-name');
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    const fetchUserProfilePhoto = async () => {
      const token = localStorage.getItem('auth-token');

      try {
        const response = await fetch(`${BASE_URL}/api/v1/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
      cancelButtonText: 'No',
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

  const handleDeleteAccount = () => {
    Swal.fire({
      title: 'Are you sure you want to delete your account?',
      text: 'This action is irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${BASE_URL}/api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire('Deleted!', 'Your account has been successfully deleted.', 'success');
              localStorage.clear();
              window.location.replace('/');
            } else {
              return response.json().then((data) => {
                throw new Error(data.message || 'Failed to delete account.');
              });
            }
          })
          .catch((error) => {
            Swal.fire('Error', error.message, 'error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your account is safe.', 'info');
      }
    });
  };

  const toggleDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="navbar">
      <header>
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <img className="logo-img" src={logo} alt="" />
        </Link>
        <nav className={navActive ? 'nav-active' : ''}>
          <div className="a">
            <div className='link-list'>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/candidates" className={location.pathname === '/candidates' ? 'active' : ''}>Politicians</Link>
              <Link to="/elections" className={location.pathname === '/elections' ? 'active' : ''}>Elections</Link>
              <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>Results</Link>
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
            </div>
            {localStorage.getItem('auth-token') ? (
              <div className="profile-section">
                <div className="welcome-message" onClick={toggleDropdown} style={{ fontSize: '16px' }}>
                  {userProfilePhoto && <img src={userProfilePhoto} alt="Profile" className="profile-photo" />}
                  <FaCaretDown className="caret-icon" />
                </div>

                {dropdownActive && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item username">Hi, {userName}</div>
                    {isCandidate && (
                      <Link to={`/candidate/${userId}`} className="dropdown-item dplink">
                        <FaUser className="icon" /> Your Profile
                      </Link>
                    )}

                    <Link to={`/edit-users/${userId}`} className="dropdown-item dplink">
                      <FaUserEdit className="icon" /> Edit Profile
                    </Link>

                    {isCandidate && (
                      <Link to={`/description`} className='dropdown-item dplink'>
                        <FaFileAlt className="icon" /> Add Description
                      </Link>
                    )}

                    {isCandidate && (
                      <Link to={`/complaints`} className='dropdown-item dplink'>
                        <FaExclamationCircle className="icon" /> Complaints
                      </Link>
                    )}

                    <Link to={`/filed-complaints/${userId}`} className='dropdown-item dplink'>
                      <FaCheckCircle className="icon" /> Filed Complaints
                    </Link>
                    <div className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="icon" /> Logout
                    </div>
                    <div className="dropdown-item delete-acc" onClick={handleDeleteAccount}>
                      <FaTrashAlt className="icon" /> Delete Account
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="tooltip-container" data-tooltip="Login" style={{ fontSize: '18px' }}>
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Add Dark/Light Mode Button */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </div>

        <div className="hamburger" onClick={handleNavToggle}>
          &#9776;
        </div>
      </header>
    </div>
  );
};

export default Navbar;
