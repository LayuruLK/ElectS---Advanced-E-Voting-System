import React, { useState } from 'react'
import './PresidentialElection.css'

const PresidentialElection = () => {
  const [year, setYear] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  return (
    <div className='presidential-election-container'>
      <h2>Presidential Election Form</h2>
      <form className='presidential-election-form'>
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
