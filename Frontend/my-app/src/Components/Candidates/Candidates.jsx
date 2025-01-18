import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Candidates.css';
import vote from '../Assests/online-voting.png';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/candidates');
        setCandidates(response.data.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) 
    return (
      <p className="err-load">
        <i className="fas fa-spinner"></i>
        Loading...
      </p>
    );
    
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`candidatee-list ${theme}`}>
      {candidates.length > 0 ? (
        <ul className="candidatee-ul">
          {candidates.map(candidate => {
            if (!candidate.user) return null; // Skip candidates without a user

            return (
              <li key={candidate._id} className="candidatee-item">
                <Link to={`/candidate/${candidate.user._id}`}>
                  <div className="candidatee-content">
                    <div className="candidatee-img">
                      <img
                        className="candidatee-main-img"
                        src={`http://localhost:5000/${candidate.user.profilePhoto}`}
                        alt={`${candidate.user.name}'s profile`}
                      />
                    </div>
                    <div className="candidatee-details">
                      <h2>{candidate.user.firstName} {candidate.user.lastName}</h2>
                      <p><strong>City:</strong> {candidate.user.city}</p>
                      <p><strong>District:</strong> {candidate.user.district}</p>
                      <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
                      <p><strong>Objectives:</strong> {candidate.objectives.join(', ')}</p>
                      <p><strong>Bio:</strong> {candidate.bio}</p>
                      {/* <p><strong>Votes:</strong> {candidate.votes.length}</p> {/* Display vote count */}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="err-nocand">
          <i className="fas fa-ban"></i>
          No Candidates Found.
        </p>
      )}
    </div>
  );
};

export default Candidates;
