import React, { useState } from 'react';
import axios from 'axios';
import './ParlimentElection.css';

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
          const response = await axios.post('http://localhost:5000/api/v1/parlimentaryElections/', electionDetails);
    
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
        </>
      );
};

export default ParlimentElection;