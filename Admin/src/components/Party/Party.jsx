import React from 'react';
import './Party.css';
import { Link } from 'react-router-dom';


const Party = () => {
  return (
    <div className='dashboardd-containerr'>    
        <Link to={'/party-list'} style={{textDecoration: "none"}}>
            <div className="cardoneee">
                <p>All Parties</p>
            </div>
        </Link>

        <Link to={'/update-party'} style={{textDecoration: "none"}}>
            <div className="cardtwooo">
                <p>Update Party</p>
            </div>
        </Link>

        <Link to={'/add-party'} style={{textDecoration: "none"}}>
            <div className="cardtreeee">
                <p>Add Party</p>
            </div>
        </Link>
    </div>
  )
}

export default Party
