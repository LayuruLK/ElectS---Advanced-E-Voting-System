import React, { useEffect , useState } from 'react';
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
                const approvedComplaints = response.data.data.filter(complaint => complaint.isReviewed === true); 
                setComplaints(approvedComplaints);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaintsDetails();
    }, [userId]); 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="candidate-complaints">
                <h3>Complaints</h3>
                {complaints.length > 0 ? (
                    <ul className="complaint-list">
                        {complaints.map(complaint => (
                            <li key={complaint._id} className="complaint-item">
                                <h4>{complaint.title}</h4>
                                <p>{complaint.description}</p>
                                {complaint.proofs.length > 0 && (
                                    <div className="complaint-attachments">
                                        <p><strong>Proofs:</strong></p>
                                        {complaint.proofs.map((proof, index) => (
                                            <a
                                                key={index}
                                                href={`http://localhost:5000/${proof}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
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
                    <p>No approved complaints found.</p>
                )}
            </div>
        </div>
    );
};

export default Complaint;