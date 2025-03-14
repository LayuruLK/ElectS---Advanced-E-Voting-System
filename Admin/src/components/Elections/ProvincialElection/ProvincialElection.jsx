import React, { useState } from 'react';
import './ProvincialElection.css';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProvincialElection = () => {
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [province, setProvince] = useState('');

  // Create an array of years starting from 2020 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const electionData = {
      year,
      date,
      startTime,
      endTime,
      description,
      rules,
      province
    };

    try {
      const response = await fetch(`${BASE_URL}/api/v1/provincialElections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(electionData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Provincial election added successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error adding election!');
    }
  };

  return (
    <div className="provincial-election-form">
      <h2 className='p-election-h2'>Add Provincial Election</h2>
      <form onSubmit={handleSubmit}>
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="">Select Year</option>
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>{yearOption}</option>
          ))}
        </select>
        
        <label>Province</label>
        <select value={province} onChange={(e) => setProvince(e.target.value)} required>
          <option value="Central">Central</option>
          <option value="Eastern">Eastern</option>
          <option value="Northern">Northern</option>
          <option value="Southern">Southern</option>
          <option value="Western">Western</option>
          <option value="North Western">North Western</option>
          <option value="North Central">North Central</option>
          <option value="Uva">Uva</option>
          <option value="Sabaragamuwa">Sabaragamuwa</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <label>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <label>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>Rules</label>
        <textarea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
        />
        

        <button type="submit">Add Election</button>
      </form>
    </div>
  );
}

export default ProvincialElection;
