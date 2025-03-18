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
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch all parties on component mount
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/parties`);
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
        const response = await axios.delete(`${BASE_URL}/api/v1/parties/${id}`);
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

  return (
    <>
      <Party />
      <div className="ptylstcon">
        <div className="main-content">
          <h1 className="header">Party List</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a party..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="party-table">
            {filteredParties.length > 0 ? (
              filteredParties.map((party) => (
                <div key={party._id} className="party-item">
                  <div className="party-info">
                    <h2 className="party-name">{party.name}</h2>
                    <p>
                      <strong>Abbreviation:</strong> {party.abbreviation}
                    </p>
                    {/* <p>
                      <strong>Leader:</strong> {party.leader}
                    </p> */}
                    <p>
                      <strong>Founding Date:</strong>{' '}
                      {new Date(party.foundingDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Website:</strong>{' '}
                      <a href={party.website} target="_blank" rel="noopener noreferrer">
                        {party.website}
                      </a>
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(party._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">
                {errorMessage || 'No parties found. Try adjusting your search or check back later.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PartyList;
