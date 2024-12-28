import React, { useState } from 'react';
import './ElectionList.css';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredElections, setFilteredElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="election-list-container">
      <h1 className="header">Election List</h1>
    </div>
  );
};

export default ElectionList;
