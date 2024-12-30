import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CandidateProfile.css';
import Complaint from '../Complaint/Complaint';
import { FaUser, FaTasks, FaExclamationCircle } from 'react-icons/fa'; // React Icons

const CandidateProfile = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // References for sections
    const personalDetailsRef = useRef(null);
    const projectsRef = useRef(null);
    const complaintsRef = useRef(null);
  
    // Scroll to specific section
    const scrollToSection = (ref) => {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    };








export default CandidateProfile;
