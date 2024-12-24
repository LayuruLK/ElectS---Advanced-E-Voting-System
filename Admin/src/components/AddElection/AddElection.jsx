import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';
import DatePicker from 'react-datepicker'; // For Date Picker UI
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles


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

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    if (date >= endTime) {
      const newEndTime = new Date(date);
      newEndTime.setHours(newEndTime.getHours() + 1); // Add 1 hour to start time for end time
      setEndTime(newEndTime);
    }
  };

  const handleEndTimeChange = (date) => {
    if (date <= startTime) {
      alert('End time must be later than start time');
      return;
    }
    setEndTime(date);
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
          <div className="time-period">
            <label>Select Time Period:</label>
            <DatePicker
              selected={startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="HH:mm"
              className="time-picker"
            />
            <span>to</span>
            <DatePicker
              selected={endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="HH:mm"
              className="time-picker"
            />
          </div>
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