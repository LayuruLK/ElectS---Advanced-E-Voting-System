import React, { useState, useEffect } from 'react';
import './ComplaintList.css'; // Style the component
import axios from 'axios';
import { Link } from 'react-router-dom';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user details from localStorage
    const userId = localStorage.getItem('user-id');
    const isCandidate = localStorage.getItem('user-isCandidate') === 'true';


    // Fetch complaints when component mounts
    useEffect(() => {
        if (!userId || !isCandidate) {
            setError('Invalid user or user is not a candidate');
            setLoading(false);
            return;
        }

        // Fetch complaints for the candidate
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/complaints/comp/reviewed/${userId}`);
                setComplaints(response.data.data);  // Assuming the data is in 'data' field
            } catch (err) {
                setError('Failed to fetch complaints');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [userId, isCandidate]);

    if (loading) {
        return <div className="complaint-list__loading">Loading complaints...</div>;
    }

    if (error) {
        return <div className="complaint-list__error">{error}</div>;
    }

    return (
        <div className="complaint-list">
            <h3 className="complaint-list__title">Complaints for Candidate</h3>
            {complaints.length === 0 ? (
                <p className="complaint-list__no-complaints">No complaints filed against you.</p>
            ) : (
                <ul className="complaint-list__items">
                    {complaints.map((complaint) => (
                        <li key={complaint._id} className="complaint-list__item">
                            <div className="complaint-list__item-header">
                                <h4 className="complaint-list__item-title">{complaint.title}</h4>
                                <span className="complaint-list__item-date">
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="complaint-list__item-description">{complaint.description}</p>
                            <div className="complaint-list__item-proof">
                                {complaint.proofs.length > 0 && (
                                    <div>
                                        <strong className="complaint-list__item-proof-title">Attached Proofs:</strong>
                                        <ul className="complaint-list__item-proof-list">
                                            {complaint.proofs.map((proof, index) => (
                                                <li key={index} className="complaint-list__item-proof-item">
                                                    <a
                                                        href={`http://localhost:5000/${proof}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="complaint-list__item-proof-link"
                                                    >
                                                        View Proof {index + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className='complaint-list__item-btnContainer'>
                                <Link to={`/report/${complaint._id}`}>Report As Fake</Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ComplaintList;