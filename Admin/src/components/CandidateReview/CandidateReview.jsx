import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CandidateReview.css';
import axios from 'axios';
import Review from '../Review/Review'
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CandidateReview = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pending candidates
    axios
      .get(`${BASE_URL}/api/v1/candidates/pending-verifications`)
      .then((response) => {
        if (response.data.success) {
          setCandidates(response.data.users);
        }
      })
      .catch((error) => console.error('Error fetching candidates:', error));
  }, []);

  const handleRowClick = (id) => {
    navigate(`/candidate-profile/${id}`);
  };

  return (
    <>
    <Review/>
    <div className="candidate-review-container">
      <h1 className='headcndt'>Pending Candidate Approvals</h1>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Candidate Profile Picture</th>
            <th>Candidate Name</th>
            <th>Candidate's Political Party</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.user._id} onClick={() => handleRowClick(candidate._id)}>
              <td>
                <img
                  src={`${BASE_URL}/${candidate.user.profilePhoto}`}
                  alt="Profile"
                  className="profile-image"
                />
              </td>
              <td>{candidate.user.firstName} {candidate.user.lastName}</td>
              <td>{candidate.party.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default CandidateReview;
