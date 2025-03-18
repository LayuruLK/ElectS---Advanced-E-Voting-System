import React, { useState } from 'react';
import './ReportFake.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;


const ReportFake = () => {
   const { id } = useParams(); 
   const [explanation, setExplanation] = useState('');
   const [proofs, setProofs] = useState([]);
   const [message, setMessage] = useState('');
 
   
   const handleFileChange = (e) => {
     setProofs(e.target.files);
   };
 
   const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('complaintId', id);
    formData.append('explanation', explanation);
    Array.from(proofs).forEach((file) => {
      formData.append('proofs', file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/reportFakes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message || 'Report submitted successfully!');
    } catch (err) {
      setMessage('Failed to submit the report. Please try again.');
    }
  };

   return (
    <div className="report-fake">
      <h3 className="report-fake__title">Report Fake Complaint</h3>
      <form className="report-fake__form" onSubmit={handleSubmit}>
        <label htmlFor="explanation" className="report-fake__label">
          Explanation
        </label>
        <textarea
          id="explanation"
          className="report-fake__textarea"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          required
        ></textarea>

        <label htmlFor="proofs" className="report-fake__label">
          Upload Proofs
        </label>
        <input
          type="file"
          id="proofs"
          className="report-fake__file-input"
          multiple
          onChange={handleFileChange}
        />

        <button type="submit" className="report-fake__submit-btn">
          Submit Report
        </button>
      </form>
      {message && <p className="report-fake__message">{message}</p>}
    </div>
  );
};

export default ReportFake;
