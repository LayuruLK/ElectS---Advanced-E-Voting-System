import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';
import './ElectionList.css';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredElections, setFilteredElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
  
    fetchElections();
  }, []);
  

};
