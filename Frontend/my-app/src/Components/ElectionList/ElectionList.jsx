import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';
import './ElectionList.css';

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredElections, setFilteredElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
};
