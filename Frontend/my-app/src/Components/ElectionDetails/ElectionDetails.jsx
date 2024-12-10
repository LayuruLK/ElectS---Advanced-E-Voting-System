import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ElectionDetails.css';
import { useParams } from 'react-router-dom';

const ElectionDetails = () => {
  const { id } = useParams(); 
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="election-details-container">
      <h2 className="election-title">{election.name}</h2>
      <p className="election-description">{election.description}</p>
    </div>
  );
};

export default ElectionDetails;
