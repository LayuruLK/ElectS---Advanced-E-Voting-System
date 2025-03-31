import React from 'react';
import './Review.css';
import { Link } from 'react-router-dom';

const Review = () => {
  const isCandidate = localStorage.getItem('user-isCandidate') === 'true';
  const userId = localStorage.getItem('user-id');

  return (
    <div className='dashboardd-container'>
        <div className='cardonee'>
            <Link to={`/nic-review`}>NIC Review</Link>
        </div>

        <div className="cardtwoo">
            <Link to='/project-review'>Project Review</Link>
        </div>
            
         <div className="cardtreee">
            <Link to={`/complaint-review`}>Complaint Review</Link>    
        </div>

        <div className="cardtreee">
            <Link to={`/candidate-review`}>Candidate Review</Link>    
        </div>  

        <div className="cardtreee">
            <Link to={`/report-review`}>Report Review</Link>    
        </div>  
    </div>
  )
}

export default Review;
