import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ElectionDetailsParlimentary.css';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import vote from '../Assests/online-voting.png';

const ElectionDetailsParlimentary = () => {
  const { id } = useParams(); // Get the election ID from the URL
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const [countdown, setCountdown] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const [electionResponse, candidatesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/parlimentaryElections/election/${id}`),
          axios.get('http://localhost:5000/api/v1/candidates')
        ]);
        
        const electionData = electionResponse.data.data;
        
        setElection(electionData);
        const candidates = candidatesResponse.data.data;
        setCandidates(candidates);

        // Check if the user has already voted
        const userId = localStorage.getItem('user-id');
        const votedCandidate = electionData.results.voteDistribution.find(candidate => candidate.voters.includes(userId));
        if (votedCandidate) {
          setVotedCandidateId(votedCandidate._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [id]);

};  