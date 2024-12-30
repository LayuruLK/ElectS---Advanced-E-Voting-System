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

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const [candidateRes, projectsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/v1/candidates/user/profile/${id}`),
                    axios.get(`http://localhost:5000/api/v1/projects/${id}`),
                ]);
                setCandidate(candidateRes.data.data);
                setProjects(projectsRes.data.data.filter((project) => project.isReviewed)); 
            } catch (err) {
                setError(err.message);   
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateData();
    }, [id]);








export default CandidateProfile;
