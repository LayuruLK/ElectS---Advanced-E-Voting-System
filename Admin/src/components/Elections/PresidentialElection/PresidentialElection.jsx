import React, { useState } from 'react'
import axios from 'axios'
import './PresidentialElection.css'
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PresidentialElection = () => {
  const [year, setYear] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [error, setError] = useState('')

  const handleFormSubmit = async e => {
    e.preventDefault()

    const electionDetails = {
      year,
      date,
      startTime,
      endTime,
      description,
      rules
    }
    try {
      // Making a POST request to the backend API to save the election details
      const response = await axios.post(
        `${BASE_URL}/api/v1/presidentialElections/`,
        electionDetails
      )

      if (response.data.success) {
        alert('Election details submitted successfully!')
        // Optionally, reset the form after successful submission
        setYear('')
        setDate('')
        setStartTime('')
        setEndTime('')
        setDescription('')
        setRules('')
      } else {
        alert('Failed to submit election details')
      }
    } catch (error) {
      console.error('Error submitting election details:', error)
      setError('An error occurred while submitting the election details.')
    }
  }
  return (
    <div className='presidential-election-container'>
      <h2>Presidential Election Form</h2>
      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={handleFormSubmit} className='presidential-election-form'>
        {/* Year Dropdown */}
        <label htmlFor='year'>Year</label>
        <select
          id='year'
          value={year}
          onChange={e => setYear(e.target.value)}
          className='form-field'
          required
        >
          <option value='' disabled>
            Select Year
          </option>
          <option value='2025'>2025</option>
          <option value='2026'>2026</option>
          <option value='2027'>2027</option>
          <option value='2028'>2028</option>
          <option value='2029'>2029</option>
          <option value='2030'>2030</option>
        </select>
        {/* Date Picker */}
        <label htmlFor='date'>Date</label>
        <input
          type='date'
          id='date'
          value={date}
          onChange={e => setDate(e.target.value)}
          className='form-field'
          required
        />
        {/* Start Time */}
        <label htmlFor='start-time'>Start Time</label>
        <input
          type='time'
          id='start-time'
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className='form-field'
          required
        />
        {/* End Time */}
        <label htmlFor='end-time'>End Time</label>
        <input
          type='time'
          id='end-time'
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className='form-field'
          required
        />
        {/* Description */}
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          value={description}
          onChange={e => setDescription(e.target.value)}
          className='form-field'
          placeholder='Enter a brief description'
          required
        ></textarea>
        {/* Rules */}
        <label htmlFor='rules'>Rules</label>
        <textarea
          id='rules'
          value={rules}
          onChange={e => setRules(e.target.value)}
          className='form-field'
          placeholder='Enter the rules'
          required
        ></textarea>
        <button type='submit' className='submit-btn'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default PresidentialElection
