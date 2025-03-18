import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import './ComplaintForm.css';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ComplaintForm = () => {
  const { theme } = useTheme();
  const  userId  = localStorage.getItem('user-id');
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proofs, setProofs] = useState([]);
   
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/candidates`);
        setCandidates(response.data.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch candidates', 'error');
      }
    };

    fetchCandidates();
  }, []);

  const handleProofsChange = (e) => {
    setProofs([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user', userId);
    formData.append('candidate', candidate);
    formData.append('title', title);
    formData.append('description', description);
    proofs.forEach(file => formData.append('proofs', file));
    

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/complaints`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('Success', 'Complaint submitted successfully', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to submit complaint', 'error');
    }
  };

  return (
    <div className={`complaint-form-container ${theme}`}>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label>Candidate</label>
          <select
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            required
          >
            <option value="">Select a candidate</option>
            {candidates.map((cand) => (
              <option key={cand._id} value={cand._id}>
                 {cand?.user?.firstName && cand?.user?.lastName 
                  ? `${cand.user.firstName} ${cand.user.lastName}` 
                  : 'Unknown Candidate'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Proofs</label>
          <input
            type="file"
            multiple
            onChange={handleProofsChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
