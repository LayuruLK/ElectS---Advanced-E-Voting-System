import React, { useEffect, useState } from 'react';
import './ComplaintReview.css';
import Review from '../Review/Review';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ComplaintReview = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/v1/complaints/show/pending-reviews`)
            .then(response => response.json())
            .then(data => setComplaints(data.data));
    }, []);

    const reviewComplaint = (complaintId, isReviewed, reviewComments) => {
        fetch(`${BASE_URL}/api/v1/complaints/review/${complaintId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isReviewed, reviewComments })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Complaint review updated successfully');
                setComplaints(complaints.filter(complaint => complaint._id !== complaintId)); // Remove reviewed complaint
            }
        });
    };

    return (
      <>
        <Review/>
        <div className="review-panel">
            <h1 className='headcmplnt'>Pending Complaint Reviews</h1>
            <table>
                <thead>
                    <tr>
                        <th className='clmone'>Candidate</th>
                        <th className='clmtwo'>Title</th>
                        <th className='clmthree'>Description</th>
                        <th className='clmfour'>Proofs</th>
                        <th className='clmfive'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(complaint => (
                        <tr key={complaint._id}>
                            <td>{complaint.candidate.user.firstName} {complaint.candidate.user.lastName}</td>
                            <td>{complaint.title}</td>
                            <td>{complaint.description}</td>
                            <td>
                                {complaint.proofs.map((proof, index) => (
                                    <a key={index} href={proof} target="_blank" rel="noreferrer">
                                        View Proof {index + 1}
                                    </a>
                                ))}
                            </td>
                            <td>
                                <button className="btn" onClick={() => reviewComplaint(complaint._id, true, 'Complaint approved')}>Approve</button>
                                <button className="btn" onClick={() => reviewComplaint(complaint._id, false, 'Complaint rejected')}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default ComplaintReview;
