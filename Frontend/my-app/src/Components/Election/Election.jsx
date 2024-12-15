import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
//import './Election.css';

const Election = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  const userId = localStorage.getItem('user-id');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/elections');
        setElections(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      elections.forEach(election => {
        const now = new Date();
        const startTime = new Date(election.startTime);
        const endTime = new Date(election.endTime);
        let timeLeft = startTime - now;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[election._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (now >= startTime && now <= endTime) {
          newCountdowns[election._id] = 'Election has started!';
        } else {
          newCountdowns[election._id] = 'Election has ended!';
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [elections]);

  const checkIfUserIsCandidate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/profile/${userId}`);
      return response.data.isCandidate;
    } catch (err) {
      Swal.fire('Error', 'Failed to check user status', 'error');
      return false;
    }
  };

  const handleApply = async (electionId) => {
    const isCandidate = await checkIfUserIsCandidate();

    if (!isCandidate) {
      return Swal.fire('Error', 'You aren\'t a candidate', 'error');
    }

    const election = elections.find(e => e._id === electionId);
    const now = new Date();
    const deadline = new Date(election.startTime);
    deadline.setDate(deadline.getDate() - 3);

    if (now > deadline) {
      return Swal.fire('Error', 'The due date has ended!', 'error');
    }

    try {
      const result = await Swal.fire({
        title: 'Confirm Application',
        text: 'Are you sure you want to apply for this election?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const response = await axios.post(`http://localhost:5000/api/v1/elections/${electionId}/apply`, { userId });
        Swal.fire('Applied!', response.data.message, 'success');
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'An error occurred', 'error');
    }
  };

  if (loading) 
    return (
      <p className="err-load">
        <i className="fas fa-spinner"></i>
        Loading...
      </p>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="election-list">
      {elections.length > 0 ? (
        <ul type="none">
          {elections.map(election => {
            return (
              <li key={election._id} className="election-item">
                <Link to={`/election/${election._id}`}>
                  <h2>{election.name}</h2>
                  <p><strong>Location:</strong> {election.where}</p>
                  <p><strong>Date:</strong> {new Date(election.date).toLocaleDateString()}</p>
                  <p><strong>Start Time:</strong> {election.startTime}</p>
                  <p><strong>End Time:</strong> {election.endTime}</p>
                  <p><strong>Description:</strong> {election.description}</p>
                  {election.rules && <p><strong>Rules:</strong> {election.rules}</p>}
                  <p><strong>Countdown:</strong> {countdowns[election._id]}</p>
                </Link>
                <button onClick={() => handleApply(election._id)} className='apply-btn'>
                  <span className='apply-txt'>Apply</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="err-nocand">
            <i className="fas fa-ban"></i>
            No Elections Found.
        </p>
      )}
    </div>
  );
};

export default Election;
