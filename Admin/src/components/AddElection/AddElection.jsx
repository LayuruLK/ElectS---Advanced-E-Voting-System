import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';


const AddElection = () => {
  const [formData, setFormData] = useState({
    name: '',
    where: '',
    date: '',
    description: '',
    rules: '',
  });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ElectionSideBar />
      <div className="add-election">
        <div className="form-container">
          <h1>Add New Election</h1>
          <form>
          <input
            type="text"
            name="name"
            placeholder="Election Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="where"
            placeholder="Location"
            value={formData.where}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <textarea
            name="rules"
            placeholder="Rules"
            value={formData.rules}
            onChange={handleChange}
          />
          
          <button type="submit">Add Election</button>
        </form>
        </div>
      </div>
    </>
  );
};

export default AddElection;