import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Complaint.css';
import { FaFileAlt } from 'react-icons/fa'; // React Icons
import pdfIcon from '../Assests/pdf.png'; // Custom PDF Icon
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Complaint = ({ userId }) => {
    const { id } = useParams();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchComplaintsDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/complaints/comp/${userId}`);
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

    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className={`complaints-container ${theme}`}>
            <h3 className="complaints-title">Complaints</h3>
            {complaints.length > 0 ? (
                <ul className="complaints-list">
                    {complaints.map(complaint => (
                        <li key={complaint._id} className={`complaint-card ${theme}`}>
                            <h4 className="complaint-title">{complaint.title}</h4>
                            <p className={`complaint-description ${theme}`}>{complaint.description}</p>
                            {complaint.proofs.length > 0 && (
                                <div className="complaint-attachments">
                                    <p><strong>Proofs:</strong></p>
                                    <div className="attachments-container">
                                        {complaint.proofs.map((proof, index) => {
                                            const fileUrl = (proof);
                                            const isImage = /\.(jpeg|jpg|png|gif)$/i.test(proof);
                                            const isPdf = /\.pdf$/i.test(proof);

                                            return isImage ? (
                                                // Display image thumbnails for photos
                                                <img
                                                    key={index}
                                                    src={fileUrl}
                                                    alt={`Proof ${index + 1}`}
                                                    onClick={() => openImageModal(fileUrl)}
                                                    className="attachment-thumbnail"
                                                />
                                            ) : isPdf ? (
                                                // Display custom PDF icon for PDF files
                                                <a
                                                    key={index}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="file-icon-link"
                                                >
                                                    <img
                                                        src={pdfIcon}
                                                        alt="PDF Icon"
                                                        className="pdf-icon"
                                                    />
                                                </a>
                                            ) : (
                                                // Display a generic file icon for other file types
                                                <a
                                                    key={index}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="file-icon-link"
                                                >
                                                    <FaFileAlt className="file-icon" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-complaints-message">No approved complaints found.</p>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content">
                        <img src={selectedImage} alt="Zoomed Img" className='img-model-img' />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Complaint;
