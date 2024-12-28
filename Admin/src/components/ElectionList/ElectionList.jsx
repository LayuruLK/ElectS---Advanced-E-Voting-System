import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import './ElectionList.css';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredElections, setFilteredElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all elections on component mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/elections');
        if (response.data.success && Array.isArray(response.data.data)) {
          setElections(response.data.data);
          setFilteredElections(response.data.data);
        } else {
          setErrorMessage("Failed to fetch elections");
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
        setErrorMessage('Error fetching election data');
      }
    };
  
    fetchElections();``
  }, []);

  // Update filtered elections when search term changes
  useEffect(() => {
    setFilteredElections(
      elections.filter(election =>
        election.name && election.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, elections]);
  
  return (
    <div className="election-list-container">
      <h1 className="header">Election List</h1>
      <input
  type="text"
  className="search-bar"
  placeholder="Search for an election..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>;

<div className="election-table">
  {filteredElections.length > 0 ? (
    filteredElections.map((election) => (
      <div key={election._id} className="election-item">
        <h2 className="election-name">{election.name}</h2>
        <p><strong>Location:</strong> {election.where}</p>
        <p><strong>Date:</strong> {new Date(election.date).toLocaleDateString()}</p>
        <p><strong>Time Period:</strong> {election.timeperiod}</p>
        <p><strong>Description:</strong> {election.description}</p>
      </div>
    ))
  ) : (
    <p className="no-results">No elections found</p>
  )}
</div>

    </div>
  );
};

export default ElectionList;
