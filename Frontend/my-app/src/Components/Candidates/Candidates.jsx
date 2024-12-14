import React, { useEffect, useState } from 'react'
import './Candidates.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoding] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() =>{
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/candidates');
                setCandidates(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoding(true)
            }
        };
        fetchCandidates();
    }, []);

    if (loading) 
        return (
          <p className="err-load">
            <i className="fas fa-spinner"></i>
            Loading...
          </p>
        );

    if (error) return <p>Error: {error}</p>;

  return (
    <div className='candidate-list'>
      {candidates.length > 0 ? (
        <ul className='candidatee-ul'>
            {candidates.map(candidate => {
                if (!candidate.user) return null;

                return (
                    <li key={candidate._id} className='candidatee-item'>
                        <Link to={`/candidate/${candidate.user._id}`}>
                            <div className='candidatee-content'>
                                <div className='candidatee-img'>
                                    <img
                                        className='candidatee-main-img'
                                        src={`http://localhost:5000/${candidate.user.profilePhoto}`}
                                        alt={`${candidate.user.name}'s profile`}
                                    />
                                </div>
                                <div className='candidatee-details'>
                                    <h2>{candidate.user.name}</h2>
                                    <p><strong>City:</strong> {candidate.user.city}</p>
                                    <p><strong>District:</strong> {candidate.user.district}</p>
                                    <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
                                    <p><strong>Objectives:</strong> {candidate.objectives.join(', ')}</p>
                                    <p><strong>Bio:</strong> {candidate.bio}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
      ) : (
        <p className="err-nocand">
            <i className="fas fa-ban"></i>
            No Candidates Found.
        </p>
      )}
    </div>
  )
}

export default Candidates;
