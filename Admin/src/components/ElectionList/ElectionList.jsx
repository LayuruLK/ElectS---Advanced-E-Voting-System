import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';
import './ElectionList.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ElectionList = () => {
  const [generalElections, setGeneralElections] = useState([]);
  const [presidentialElections, setPresidentialElections] = useState([]);
  const [parlimentaryElections, setParlimentaryElections] = useState([]);
  const [provincialElections, setProvincialElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch elections by type
  const fetchElections = async () => {
    try {
      const generalRes = await axios.get(`${BASE_URL}/api/v1/elections`);
      const presidentialRes = await axios.get(`${BASE_URL}/api/v1/presidentialElections`);
      const parlimentaryRes = await axios.get(`${BASE_URL}/api/v1/parlimentaryElections`);
      const provincialRes = await axios.get(`${BASE_URL}/api/v1/provincialElections`);

      setGeneralElections(generalRes.data.data || []);
      setPresidentialElections(presidentialRes.data.data || []);
      setParlimentaryElections(parlimentaryRes.data.data || []);
      setProvincialElections(provincialRes.data.data || []);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setErrorMessage('Error fetching election data');
    }
  };

  // Fetch elections on component mount
  useEffect(() => {
    fetchElections();
  }, []);

  // Delete an election by ID with confirmation
const handleDelete = async (id, type) => {
  const confirmed = await swal({
    title: 'Confirm Deletion',
    text: 'Are you sure you want to delete this election? This action cannot be undone.',
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
    try {
      // Determine the endpoint based on election type
      let endpoint = `${BASE_URL}/api/v1/elections/${id}`;
      if (type === 'presidential') {
        endpoint = `${BASE_URL}/api/v1/presidentialElections/${id}`;
      } else if (type === 'parlimentary') {
        endpoint = `${BASE_URL}/api/v1/parlimentaryElections/${id}`;
      } else if (type === 'provincial') {
        endpoint = `${BASE_URL}/api/v1/ProvincialElections/${id}`;
      }

      // Send the delete request
      await axios.delete(endpoint);

      // Update state based on election type
      if (type === 'general') {
        setGeneralElections(generalElections.filter((election) => election._id !== id));
      } else if (type === 'presidential') {
        setPresidentialElections(presidentialElections.filter((election) => election._id !== id));
      } else if (type === 'parlimentary') {
        setParlimentaryElections(parlimentaryElections.filter((election) => election._id !== id));
      } else if (type === 'provincial') {
        setProvincialElections(provincialElections.filter((election) => election._id !== id));
      }

      swal('Deleted!', 'The election has been deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting election:', error);
      setErrorMessage('Error deleting the election');
      swal('Error!', 'There was an error deleting the election. Please try again.', 'error');
    }
  } else {
    swal('Cancelled', 'The election was not deleted.', 'info');
  }
};

  return (
    <>
      <ElectionSideBar />
      <div className="election-list-container">
        <div className="main-content">
          <h1 className="header">Election List</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* General Elections */}
          <div className="election-type-section">
            <h2 className="section-header">General Elections</h2>
            <div className="election-table">
              {generalElections.length > 0 ? (
                generalElections.map((election) => (
                  <div key={election._id} className="election-item">
                    <div className="election-info">
                      <h3 className="election-name">{election.name}</h3>
                      <p><strong>Location:</strong> {election.where}</p>
                      <p><strong>Date:</strong> {new Date(election.date).toLocaleDateString()}</p>
                      <p><strong>Time Period:</strong> {election.timeperiod}</p>
                      <p><strong>Description:</strong> {election.description}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(election._id, 'general')}>Delete</button>
                  </div>
                ))
              ) : (
                <p className="no-results">No general elections found</p>
              )}
            </div>
          </div>

          {/* Presidential Elections */}
          <div className="election-type-section">
            <h2 className="section-header">Presidential Elections</h2>
            <div className="election-table">
              {presidentialElections.length > 0 ? (
                presidentialElections.map((election) => (
                  <div key={election._id} className="election-item">
                    <div className="election-info">
                      <h3 className="election-name">{election.name}</h3>
                      <p><strong>Location:</strong> {election.where}</p>
                      <p><strong>Date:</strong> {new Date(election.date).toLocaleDateString()}</p>
                      <p><strong>Time Period:</strong> {election.timeperiod}</p>
                      <p><strong>Description:</strong> {election.description}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(election._id, 'presidential')}>Delete</button>
                  </div>
                ))
              ) : (
                <p className="no-results">No presidential elections found</p>
              )}
            </div>
          </div>

          {/* Parlimentary Elections */}
          <div className="election-type-section">
            <h2 className="section-header">Parliamentary Elections</h2>
            <div className="election-table">
              {parlimentaryElections.length > 0 ? (
                parlimentaryElections.map((election) => (
                  <div key={election._id} className="election-item">
                    <div className="election-info">
                      <h3 className="election-name">{election.name}</h3>
                      <p><strong>Location:</strong> {election.where}</p>
                      <p><strong>Date:</strong> {new Date(election.date).toLocaleDateString()}</p>
                      <p><strong>Time Period:</strong> {election.timeperiod}</p>
                      <p><strong>Description:</strong> {election.description}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(election._id, 'parlimentary')}>Delete</button>
                  </div>
                ))
              ) : (
                <p className="no-results">No parliamentary elections found</p>
              )}
            </div>
          </div>

          {/* Provincial Elections */}
          <div className="election-type-section">
            <h2 className="section-header">Provincial Elections</h2>
            <div className="election-table">
              {provincialElections.length > 0 ? (
                provincialElections.map((election) => (
                  <div key={election._id} className="election-item">
                    <div className="election-info">
                      <h3 className="election-name">{election.name}</h3>
                      <p><strong>Location:</strong> {election.where}</p>
                      <p><strong>Date:</strong> {new Date(election.date).toLocaleDateString()}</p>
                      <p><strong>Time Period:</strong> {election.timeperiod}</p>
                      <p><strong>Description:</strong> {election.description}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(election._id, 'provincial')}>Delete</button>
                  </div>
                ))
              ) : (
                <p className="no-results">No provincial elections found</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ElectionList;
