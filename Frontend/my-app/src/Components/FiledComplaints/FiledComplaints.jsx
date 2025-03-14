import React, { useEffect, useState } from 'react';
import "./FiledComplaints.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const FiledComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

    const userId = localStorage.getItem('user-id');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/complaints/comp/owner/${userId}`);
                setComplaints(response.data.data);
            } catch (err) {
                setError('Failed to fetch complaints');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchComplaints();
        }
    }, [userId]);

    const handleDelete = async (complaintID) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to recover this complaint!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/api/v1/complaints/${complaintID}`);
                    
                    // Update UI after deletion
                    setComplaints(prevComplaints => prevComplaints.filter(comp => comp._id !== complaintID));

                    Swal.fire("Deleted!", "Your complaint has been deleted.", "success");
                } catch (error) {
                    Swal.fire("Error!", "Failed to delete the complaint.", "error");
                    console.error("Error deleting complaint:", error);
                }
            }
        });
    };

    if (loading) {
        return <div className="complaint-list__loading">Loading complaints...</div>;
    }

    if (error) {
        return <div className="complaint-list__error">{error}</div>;
    }

    return (
        <div className={`filed-comp-container ${theme}`}>
            <h3 className={`complaint-list__title ${theme}`}>Complaints Filed by You</h3>

            {complaints.length === 0 ? (
                <p className="complaint-list__no-complaints">No complaints filed by you.</p>
            ) : (
                <ul className="complaint-list__items">
                    {complaints.map((complaint) => (
                        <li key={complaint._id} className={`complaint-list__item ${theme}`}>
                            <div className="complaint-list__item-header">
                                <h4 className="complaint-list__item-title">{complaint.title}</h4>
                                <h5 className="complaint-list__item-politician complaint-list__item-title">Politician: {complaint.candidate.user.firstName} {complaint.candidate.user.lastName}</h5>
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
                                                        href={`${BASE_URL}/${proof}`}
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
                            <div className='filed-comp-list__item-btnContainer'>
                                <button className="filed-comp-button" onClick={() => handleDelete(complaint._id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FiledComplaints;