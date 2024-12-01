import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Election.css';

const Election = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="election-list">
      <p>No elections found.</p>
    </div>
  );
};

export default Election;
