import React from 'react';
import './EditProfileCandidate.css';
import { Link } from 'react-router-dom';

const EditProfileCandidate = () => {
  const isCandidate = localStorage.getItem('user-isCandidate') === 'true';
  const userId = localStorage.getItem('user-id');

  return (
    <div className='dashboardd-container'>
        <div className='cardonee'>
            <Link to={`/candidates/personal/${userId}`}>Edit Personal Details</Link>
        </div>

        <div className="cardtwoo">
            <Link to='/candidates/add-projects'>Add a new Project</Link>
        </div>
            
         <div className="cardtreee">
            <Link to={`/candidates/edit-projects/${userId}`}>Edit A Project</Link>    
        </div> 
    </div>
  )
}

export default EditProfileCandidate
