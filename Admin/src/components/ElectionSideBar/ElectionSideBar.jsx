import React from 'react';
import './ElectionSideBar.css';
import { Link } from 'react-router-dom';


const ElectionSideBar = () => {
  return (
    <div className='dashboard-container'>    
        <Link to={'/election-list'} style={{textDecoration: "none"}}>
            <div className="cardoneee">
                <p>All Elections</p>
            </div>
        </Link>

        <Link to={'/update-election'} style={{textDecoration: "none"}}>
            <div className="cardtwooo">
                <p>Update Election</p>
            </div>
        </Link>

        <Link to={'/add-election'} style={{textDecoration: "none"}}>
            <div className="cardtreeee">
                <p>Add Election</p>
            </div>
        </Link>
    </div>
  )
}

export default ElectionSideBar
