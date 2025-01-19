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

    useEffect(() => {
        const interval = setInterval(() => {
            if (election) {
                const now = new Date();
                const startTime = new Date(election.startTime);
                const endTime = new Date(election.endTime);
                let timeLeft = startTime - now;

                if (timeLeft > 0) {
                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                } else if (now >= startTime && now <= endTime) {
                    setCountdown('Election has started!');
                } else {
                    setCountdown('Election has ended!');
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [election]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!election) return <p>No election details found.</p>;


    return (
        <div className="election-details-container">
            <h2 className="election-title">Parlimentary Election - {election.year}</h2>
            <h4 className="election-date">{new Date(election.date).toLocaleDateString()}</h4>
            <p className="election-description"><b>Starts at: </b>{election.endTime}</p>
            <p className="election-description"><b>Ends at: </b>{election.startTime}</p>
            <p className="election-description">{election.description}</p>
            <p className="election-description">{election.rules}</p>
            <p><strong>Countdown:</strong> {countdown}</p>

            <h3 className="candidates-title">Candidates</h3>
            <table className="candidates-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Vote</th>
                    </tr>
                </thead>
                <tbody>
                    {election.candidates.map((candidate, index) => (
                        <tr key={candidate._id} style={{ cursor: 'pointer' }}>
                            <td onClick={() => handleRowClick(candidate.user._id)}>{index + 1}</td>
                            <td onClick={() => handleRowClick(candidate.user._id)}>
                                <img className='profile' src={`http://localhost:5000/${candidate.user.profilePhoto}`} alt={`${candidate.user.name}`} />
                            </td>
                            <td onClick={() => handleRowClick(candidate.user._id)}>{candidate.user.firstName} {candidate.user.lastName}</td>
                            <td>
                                <div className="voteee" onClick={(e) => { e.stopPropagation(); handleVote(candidate, candidate._id); }}>
                                    <img src={vote} alt="Vote" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};  