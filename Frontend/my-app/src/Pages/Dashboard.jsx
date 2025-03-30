import React from 'react';
import './CSS/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const navigate = useNavigate();
  const isCandidate = localStorage.getItem('user-isCandidate') === 'true';
  const userId = localStorage.getItem('user-id');
  const isAuthenticate = localStorage.getItem('auth-token');

  const handleClick = (path, e) => {
    e.preventDefault(); // Prevent default link behavior
    if (!isAuthenticate) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You need to be logged in to access this page.',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } else {
      navigate(path);
    }
  };

  return (
    <div className='dashboard-container'>
        <div className='cardone'>
            <Link 
              to='/candidates' 
              className='para'
            >
              Details About Politicians
            </Link>
        </div>

        <div className="cardtwo">
            <Link 
              to={`/complaint-form/${userId}`} 
              className='para'
              onClick={(e) => handleClick(`/complaint-form/${userId}`, e)}
            >
              What do you Know About them ?
            </Link>
        </div>
            
        <div className="cardtree">
            <Link 
              to={isCandidate ? `/edit-candidates` : `/edit-users/${userId}`} 
              className='para'
              onClick={(e) => handleClick(isCandidate ? `/edit-candidates` : `/edit-users/${userId}`, e)}
            >
              Edit Profile
            </Link>              
        </div>
    </div>
  );
}

export default Dashboard;
