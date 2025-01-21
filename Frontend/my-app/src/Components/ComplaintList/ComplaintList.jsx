import React, { useState, useEffect } from 'react';
import './ComplaintList.css'; // Style the component

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch complaints when component mounts
  useEffect(() => {
    if (!userId || !isCandidate) {
      setError('Invalid user or user is not a candidate');
      setLoading(false);
      return;
    }

    // Fetch complaints for the candidate
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/complaints/comp/reviewed/${userId}`);
        setComplaints(response.data.data);  // Assuming the data is in 'data' field
      } catch (err) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <div className="complaint-list__loading">Loading complaints...</div>;
  }

  if (error) {
    return <div className="complaint-list__error">{error}</div>;
  }

    return (
        <div className="complaint-list">
          <h3 className="complaint-list__title">Complaints for Candidate</h3>
        </div>  
    );      
};  

export default ComplaintList;