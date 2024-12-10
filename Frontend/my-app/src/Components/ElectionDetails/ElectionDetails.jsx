import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ElectionDetails.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import vote from '../Assests/online-voting.png';

  
const ElectionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [votedCandidateId, setVotedCandidateId] = useState(null);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const electionResponse = await axios.get(`http://localhost:5000/api/v1/elections/election/${id}`);
        setElection(electionResponse.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!election) return <p>No election details found.</p>;

 

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

const handleRowClick = (candidateId) => {
  navigate(`/candidate/${candidateId}`);
};

const handleVote = async (candidate) => {
    if (votedCandidateId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have already voted in this election!',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to change your vote!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, vote!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`http://localhost:5000/api/v1/elections/${candidate._id}/vote`, { electionId: election._id });
          setVotedCandidateId(candidate._id);
          Swal.fire('Voted!', 'Your vote has been recorded.', 'success');
        } catch (error) {
          Swal.fire('Error', 'There was a problem submitting your vote.', 'error');
        }
      }
    });
  };

  return (
    <div className="election-details-container">
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
              <td onClick={() => handleRowClick(candidate.user._id)}>{candidate.user.name}</td>
              <td>
                <div className="voteee" onClick={(e) => { e.stopPropagation(); handleVote(candidate); }}>
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

export default ElectionDetails;
