import React, { useState, useEffect } from 'react'
import axios from 'axios'
import swal from 'sweetalert' //Import SweetAlert
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar'
import './ElectionList.css'

const ElectionList = () => {
  const [elections, setElections] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredElections, setFilteredElections] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch all elections on component mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/elections')

        if (response.data.success && Array.isArray(response.data.data)) {
          setElections(response.data.data)
          setFilteredElections(response.data.data)
        } else {
          setErrorMessage('Failed to fetch elections')
        }
      } catch (error) {
        console.error('Error fetching elections:', error)
        setErrorMessage('Error fetching election data')
      }
    };

    fetchElections();
  }, [])

  // Delete an election by ID with confirmation
  const handleDelete = async id => {
    // Show confirmation dialog
    const confirmed = await swal({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this election? This action cannot be undone.',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: 'swal-button--cancel' // Custom class for Cancel button
        },
        confirm: {
          text: 'Delete',
          value: true,
          visible: true,
          className: 'swal-button--danger' // Custom class for Confirm button
        }
      },
      dangerMode: true
    })

    // If the user confirmed deletion, proceed with the delete request
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/elections/${id}`)
        setElections(elections.filter(election => election._id !== id))
        setFilteredElections(filteredElections.filter(election => election._id !== id));
        swal('Deleted!','The election has been deleted successfully.','success'); //Success message
        } catch (error) {
        console.error('Error deleting election:', error)
        setErrorMessage('Error deleting the election')
        swal('Error!','There was an error deleting the election. Please try again.','error'); //Error message
        }
    } else {
      swal('Cancelled', 'The election was not deleted.', 'info')
    }
  };

  // Update filtered elections when search term changes
  useEffect(() => {
    setFilteredElections(
      elections.filter(election =>
          election.name && election.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, elections])

  return (
    <>
      {/* <ElectionSideBar /> */}
      <div className='election-list-container'>
        <div className='main-content'>
          <h1 className='header'>Election List</h1>
          <input
            type='text'
            className='search-bar'
            placeholder='Search for an election...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <div className='election-table'>
            {filteredElections.length > 0 ? (
              filteredElections.map(election => (
                <div key={election._id} className='election-item'>
                  <div className='election-info'>
                    <h2 className='election-name'>{election.name}</h2>
                    <p><strong>Location:</strong> {election.where}</p>
                    <p><strong>Date:</strong>{new Date(election.date).toLocaleDateString()}</p>
                    <p><strong>Time Period:</strong> {election.timeperiod}</p>
                    <p><strong>Description:</strong> {election.description}</p>
                  </div>
                  <button
                    className='delete-btn'
                    onClick={() => handleDelete(election._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className='no-results'>No elections found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectionList
