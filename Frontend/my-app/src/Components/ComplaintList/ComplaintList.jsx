import React, { useState, useEffect } from 'react';
import './ComplaintList.css'; // Style the component

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <div className="complaint-list">
          <h3 className="complaint-list__title">Complaints for Candidate</h3>
        </div>  
    );      
};  

export default ComplaintList;