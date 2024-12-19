import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import './UpdateElection.css';
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';

const UpdateElection = () => {
  const [elections, setElections] = useState([]); // Store all elections
  const [selectedElection, setSelectedElection] = useState(''); // Store the selected election ID
  const [searchTerm, setSearchTerm] = useState(''); // Store search term for filtering elections
  const [filteredElections, setFilteredElections] = useState([]); // Store filtered elections
  const [formData, setFormData] = useState({
    name: '',
    where: '',
    date: '',
    description: '',
    rules: '',
  });
  
  return (
    <>
    <ElectionSideBar/>
    <div className="update-election-container">
      <h1 className='up-ele'>Select Election to Update</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search elections by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display filtered elections as a clickable list */}
      <div className="election-list">
        {filteredElections.map((election) => (
          <div
            key={election._id}
            className="election-item"
            onClick={() => setSelectedElection(election._id)}
          >
            {election.name}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UpdateElection;
