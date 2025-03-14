import React, { useState } from 'react';
import axios from 'axios';
import './ParlimentElection.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ParlimentElection = () => {
    const [year, setYear] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules] = useState('');
    const [error, setError] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        const electionDetails = {
          year,
          date,
          startTime,
          endTime,
          description,
          rules,
        };
    
        try {
          const response = await axios.post(`${BASE_URL}/api/v1/parlimentaryElections/`, electionDetails);
    
          if (response.data.success) {
            alert('Parliamentary Election added successfully!');
            setYear('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setDescription('');
            setRules('');
          } else {
            alert('Failed to add Parliamentary Election');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          setError('An error occurred while submitting the election details.');
        }
      };

      return(
        <>
        <div className="parliament-election-container">
      <h2 className='parliment-election-h2'>Add Parliamentary Election</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleFormSubmit} className="parliament-election-form">
        <label htmlFor="year">Year</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-field"
          required
        >
          <option value="" disabled>Select Year</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>

        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-field"
          required
        />

        <label htmlFor="start-time">Start Time</label>
        <input
          type="time"
          id="start-time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="form-field"
          required
        />

        <label htmlFor="end-time">End Time</label>
        <input
          type="time"
          id="end-time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="form-field"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-field"
          placeholder="Enter a brief description"
          required
        ></textarea>

        <label htmlFor="rules">Rules</label>
        <textarea
          id="rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          className="form-field"
          placeholder="Enter the rules"
          required
        ></textarea>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
        </>
      );
};

export default ParlimentElection;