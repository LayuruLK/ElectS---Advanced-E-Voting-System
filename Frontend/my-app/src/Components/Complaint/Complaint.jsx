import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Complaint.css';

const Complaint = ({ userId }) => {
    const { id } = useParams();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaintsDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/complaints/comp/${userId}`);
                const approvedComplaints = response.data.data.filter(complaint => complaint.isReviewed === true); // Filter only approved complaints
                setComplaints(approvedComplaints);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaintsDetails();
    }, [userId]); // Use userId for dependency since it's being passed as a prop

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="complaints-container">
            <h3 className="complaints-title">Complaints</h3>
            {complaints.length > 0 ? (
                <ul className="complaints-list">
                    {complaints.map(complaint => (
                        <li key={complaint._id} className="complaint-card">
                            <h4 className="complaint-title">{complaint.title}</h4>
                            <p className="complaint-description">{complaint.description}</p>
                            {complaint.proofs.length > 0 && (
                                <div className="complaint-attachments">
                                    <p><strong>Proofs:</strong></p>
                                    {complaint.proofs.map((proof, index) => (
                                        <a
                                            key={index}
                                            href={`http://localhost:5000/${proof}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="attachment-link"
                                        >
                                            Attachment {index + 1}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-complaints-message">No approved complaints found.</p>
            )}
        </div>
    );
};

export default Complaint;
