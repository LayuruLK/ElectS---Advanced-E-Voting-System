import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ElectionDetailsProvincial.css';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import vote from '../Assests/online-voting.png';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ElectionDetailsProvincial = () => {
  const { theme } = useTheme();
  const { id } = useParams(); // Get the election ID from the URL
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const [countdown, setCountdown] = useState('');
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [isEligible, setIsEligible] = useState(false);

  const userId = localStorage.getItem('user-id')


  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const [electionResponse, candidatesResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/provincialElections/election/${id}`),
          axios.get(`${BASE_URL}/api/v1/candidates`)
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

    const fetchVoterDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/users/profile/${userId}`);
        setVoter(response.data);

        let userProvince = response.data.province
        // Remove "Province" from userProvince
        userProvince = userProvince.replace(" Province", "").trim();

        // Check eligibility
        if (userProvince === election?.province) {
          setIsEligible(true);
        }
      } catch (error) {
        console.error('Error fetching voter details:', error);
      }
    };

    fetchElectionData();
    fetchVoterDetails();
  }, [id, userId, election?.province]);

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

  const handleRowClick = (candidateId) => {
    navigate(`/candidate/${candidateId}`);
  };

  const handleVote = async (candidate, candidateId) => {
    const now = new Date();
    const startTime = new Date(election.startTime);
    const endTime = new Date(election.endTime);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    if (!isEligible) {
      alert('You are not eligible to vote in this election. You are not Belongs to Election Province!');
      return;
    }

    if (now < startTime) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Voting has not started yet!',
      });
      return;
    }

    if (now > endTime) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Voting has ended!',
      });
      return;
    }

    if (votedCandidateId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have already voted in this election!',
      });
      return;
    }

    if (!candidate.isVerified) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This candidate is not a verified Candidate!',
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
      confirmButtonText: 'Yes, vote!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('auth-token');
        const userId = localStorage.getItem('user-id');
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You need to be logged in to vote',
          });
          return;
        }

        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const videoElement = document.createElement('video');
          videoElement.srcObject = videoStream;
          await videoElement.play();

          Swal.fire({
            title: 'Verify Your Identity',
            html: '<video id="video-feed" autoplay></video>',
            didOpen: () => {
              const videoFeed = Swal.getHtmlContainer().querySelector('#video-feed');
              videoFeed.srcObject = videoStream;
            },
            showCancelButton: true,
            confirmButtonText: 'Capture',
            preConfirm: async () => {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

              // Convert the canvas image to a blob
              const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

              // Prepare FormData
              const formData = new FormData();
              formData.append('photo', blob, 'capture.png');
              formData.append('userId', userId);
              try {
                // Sending the photo as a file to the backend for face verification
                const response = await axios.post(
                  `${BASE_URL}/api/v1/verifications/facerecognition/verify`,
                  formData,

                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'Authorization': `Bearer ${token}`,
                    },
                  }
                );
                if (response.data.success) {
                  // Proceed to vote if face verification is successful
                  await axios.post(
                    `${BASE_URL}/api/v1/provincialElections/${election._id}/vote/${candidateId}`,
                    {
                      voterId: userId,
                      electionId: election._id,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setVotedCandidateId(candidateId);
                  Swal.fire('Voted!', 'Your vote has been recorded.', 'success');
                } else {
                  Swal.fire('Error', 'Face verification failed.', 'error');
                }
              } catch (error) {
                console.error('Error voting:', error);
                Swal.fire('Error', 'There was a problem submitting your vote.', 'error');
              } finally {
                videoStream.getTracks().forEach((track) => track.stop());
              }
            },
          });
        } catch (err) {
          Swal.fire('Error', 'Unable to access camera.', 'error');
        }
      }
    });
  };


  return (
    <div className={`election-details-container ${theme}`}>
      <h2 className={`election-title ${theme}`}>Provincial Council Election - {election.year}</h2>
      <h4 className="election-date">{new Date(election.date).toLocaleDateString()}</h4>
      <p className={`election-description ${theme}`}><b>Starts at: </b>{election.endTime}</p>
      <p className={`election-description ${theme}`}><b>Ends at: </b>{election.startTime}</p>
      <p className={`election-description ${theme}`}><b>Description: </b><br />{election.description}</p>
      <p className={`election-description ${theme}`}><b>Rules: </b><br />{election.rules}</p>
      <p><strong>Countdown:</strong> {countdown}</p>

      <h3 className={`candidates-title ${theme}`}>Candidates</h3>
      <table className={`candidates-table ${theme}`}>
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
                <img className='profile' src={candidate.user.profilePhoto} alt={candidate.user.firstName} />
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

export default ElectionDetailsProvincial;
