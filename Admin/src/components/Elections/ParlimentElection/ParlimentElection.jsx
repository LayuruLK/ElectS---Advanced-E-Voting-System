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
};    