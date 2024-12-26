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

  // Delete a party by ID with confirmation
  const handleDelete = async (id) => {
    try {
      const confirmed = await swal({
        title: 'Confirm Deletion',
        text: 'Are you sure you want to delete this party? This action cannot be undone.',
        icon: 'warning',
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
          },
          confirm: {
            text: 'Delete',
            value: true,
            visible: true,
            className: 'swal-button--danger',
          },
        },
        dangerMode: true,
      });

      if (confirmed) {
        const response = await axios.delete(`http://localhost:5000/api/v1/parties/${id}`);
        if (response.data.success) {
          setParties(parties.filter((party) => party._id !== id));
          setFilteredParties(filteredParties.filter((party) => party._id !== id));
          swal('Deleted!', 'The party has been successfully deleted.', 'success');
        } else {
          swal('Error!', 'Failed to delete the party. Please try again.', 'error');
        }
      } else {
        swal('Cancelled', 'The party was not deleted.', 'info');
      }
    } catch (error) {
      console.error('Error deleting party:', error);
      swal('Error!', 'An error occurred while deleting the party. Please try again.', 'error');
    }
  };

    // Update filtered parties when search term changes
    useEffect(() => {
        setFilteredParties(
          parties.filter((party) =>
            party.name && party.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }, [searchTerm, parties]);
      
};

export default PartyList;
