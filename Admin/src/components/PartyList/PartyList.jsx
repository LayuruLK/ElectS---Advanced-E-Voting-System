import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // SweetAlert for better notifications
import './PartyList.css'; // Ensure you have corresponding styling
import Party from '../Party/Party';

const PartyList = () => {
    const [parties, setParties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredParties, setFilteredParties] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    // Fetch all parties on component mount
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/parties');
        if (response.data.success && Array.isArray(response.data.parties)) {
          setParties(response.data.parties);
          setFilteredParties(response.data.parties);
        } else {
          setErrorMessage('Failed to fetch parties. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
        setErrorMessage('Unable to fetch party data. Please check your connection or try again later.');
      }
    };

    fetchParties();
  }, []);
}
