import React, { useEffect, useState } from 'react';

const Election = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/elections');
        setElections(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      elections.forEach((election) => {
        const now = new Date();
        const startTime = new Date(election.startTime);
        const endTime = new Date(election.endTime);
        const timeLeft = startTime - now;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[election._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (now >= startTime && now <= endTime) {
          newCountdowns[election._id] = 'Election has started!';
        } else {
          newCountdowns[election._id] = 'Election has ended!';
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [elections]);
};
const checkIfUserIsCandidate = async () => {
    try {
      const userId = localStorage.getItem('user-id');
      const response = await axios.get(`http://localhost:5000/api/v1/users/profile/${userId}`);
      return response.data.isCandidate;
    } catch (err) {
      Swal.fire('Error', 'Failed to check user status', 'error');
      return false;
    }
  };
  
export default Election;