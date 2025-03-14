import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CandidateProfile.css';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch candidate profile
    axios
      .get(`${BASE_URL}/api/v1/candidates/profile/${id}`)
      .then((response) => {
        setCandidate(response.data.data);
      })
      .catch((error) => console.error('Error fetching candidate profile:', error));
  }, [id]);

  const handleVerification = (isVerified) => {
    axios
      .put(`${BASE_URL}/api/v1/candidates/verify/${id}`, { isVerified })
      .then(() => {
        alert(`Candidate has been ${isVerified ? 'approved' : 'rejected'} successfully.`);
        navigate('/candidate-review');
      })
      .catch((error) => console.error('Error updating verification status:', error));
  };

  if (!candidate) {
    return <p>Loading...</p>;
  }

  return (
    <div className="candidate-profile-container">
      <h1 className='adcanproh1'>Candidate Profile</h1>
      <div className="profile-details">
        <img src={`${BASE_URL}/${candidate.user.profilePhoto}`} alt="Profile" className="profile-photo" />
        <h2>{candidate.user.name}</h2>
        <p>
          <strong>Party:</strong> {candidate.party.name}
        </p>
        <p>
          <strong>Skills:</strong> {candidate.skills.join(', ')}
        </p>
        <p>
          <strong>Objectives:</strong> {candidate.objectives.join(', ')}
        </p>
        <p>
          <strong>Bio:</strong> {candidate.bio}
        </p>
      </div>
      <div className="action-buttons">
        <button onClick={() => handleVerification(true)} className="approve-button">
          Approve as a Candidate
        </button>
        <button onClick={() => handleVerification(false)} className="reject-button">
          Reject
        </button>
      </div>
    </div>
  );
};

export default CandidateProfile;
