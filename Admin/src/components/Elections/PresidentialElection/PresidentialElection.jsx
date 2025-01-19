import React, { useState } from 'react'
import './PresidentialElection.css'

const PresidentialElection = () => {
  return (
    <div className='presidential-election-container'>
      <h2>Presidential Election Form</h2>
      <form className='presidential-election-form'>
        {/* Year Dropdown */}
        <label htmlFor='year'>Year</label>
        <select id='year' className='form-field' required>
          <option value='' disabled>
            Select Year
          </option>
          <option value='2025'>2025</option>
          <option value='2026'>2026</option>
          <option value='2027'>2027</option>
        </select>
        {/* Date Picker */}
        <label htmlFor='date'>Date</label>
        <input type='date' id='date' className='form-field' required />
        {/* Start Time */}
        <label htmlFor='start-time'>Start Time</label>
        <input type='time' id='start-time' className='form-field' required />
        {/* End Time */}
        <label htmlFor='end-time'>End Time</label>
        <input type='time' id='end-time' className='form-field' required />
        {/* Description */}
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          className='form-field'
          placeholder='Enter a brief description'
          required
        ></textarea>
        {/* Rules */}
        <label htmlFor='rules'>Rules</label>
        <textarea
          id='rules'
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
