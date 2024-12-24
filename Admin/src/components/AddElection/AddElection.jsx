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
  const [countdown, setCountdown] = useState(null); // To track the countdown
  const [isElectionHappening, setIsElectionHappening] = useState(false); // To track election status


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Countdown calculation function
  const calculateCountdown = (startDateTime) => {
    const electionStart = new Date(startDateTime);
    const interval = setInterval(() => {
    const currentTime = new Date();
    const timeLeft = electionStart - currentTime; // Time remaining in ms

      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsElectionHappening(false);
        setCountdown('Election Finished');
      } else {
        const hours = Math.floor(timeLeft / 1000 / 60 / 60);
        const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        setCountdown(`${hours}:${minutes}:${seconds}`);
        setIsElectionHappening(true);
      }
    }, 1000);

    return interval;
  };

  useEffect(() => {
    if (formData.date && startTime) {
      const electionStartTime = new Date(formData.date);
      electionStartTime.setHours(startTime.getHours(), startTime.getMinutes());
      const interval = calculateCountdown(electionStartTime);

      return () => clearInterval(interval); // Cleanup the interval
    }
  }, [formData.date, startTime]);

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