import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import './Election.css';

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
      return Swal.fire('Error', "You aren't a candidate", 'error');
    }

    try {
      const result = await Swal.fire({
        title: 'Confirm Application',
        text: 'Are you sure you want to apply for this election?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await axios.post(`http://localhost:5000/api/v1/elections/${electionId}/apply`, { userId });
        Swal.fire('Applied!', response.data.message, 'success');
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'An error occurred', 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="el-lst-container">
      <h1 className="el-lst-title">Elections</h1>
      {elections.length > 0 ? (
        <div className="el-lst-table">
          {elections.map(election => (
            <div key={election._id} className="el-lst-item">
              <Link to={`/election/${election._id}`}>
              <table className="el-lst-details">
                <tbody>
                  <tr>
                    <td style={{ width: '20%' }}><strong>Election Name:</strong></td>
                    <td style={{ width: '80%' }} className='el-lst-name'>{election.name}</td>
                  </tr>
                  <tr>
                    <td style={{ width: '20%' }}><strong>Location:</strong></td>
                    <td style={{ width: '80%' }}>{election.where}</td>
                  </tr>
                  <tr>
                    <td style={{ width: '20%' }}><strong>Date:</strong></td>
                    <td style={{ width: '80%' }}>{new Date(election.date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style={{ width: '20%' }}><strong>Start Time:</strong></td>
                    <td style={{ width: '80%' }}>{election.startTime}</td>
                  </tr>
                  <tr>
                    <td style={{ width: '20%' }}><strong>End Time:</strong></td>
                    <td style={{ width: '80%' }}>{election.endTime}</td>
                  </tr>
                  {/* <tr>
                    <td style={{ width: '20%' }}><strong>Description:</strong></td>
                    <td style={{ width: '80%' }}>{election.description}</td>
                  </tr>
                  {election.rules && (
                    <tr>
                      <td style={{ width: '20%' }}><strong>Rules:</strong></td>
                      <td style={{ width: '80%' }}>{election.rules}</td>
                    </tr>
                  )} */}
                  <tr>
                    <td style={{ width: '20%' }}><strong>Countdown:</strong></td>
                    <td style={{ width: '80%' }}>{countdowns[election._id]}</td>
                  </tr>
                </tbody>
              </table>
              </Link>
              <button
                onClick={() => handleApply(election._id)}
                className="el-lst-apply-btn"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="el-lst-empty">No elections found.</p>
      )}
    </div>
  );
};

export default Election;
