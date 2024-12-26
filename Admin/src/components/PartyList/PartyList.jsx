import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // SweetAlert for better notifications
import './PartyList.css'; // Ensure you have corresponding styling
import Party from '../Party/Party';

const PartyList = () => {
    const [parties, setParties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredParties, setFilteredParties] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

