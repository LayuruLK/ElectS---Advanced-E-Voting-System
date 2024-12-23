import React, { useEffect, useState } from 'react';
import './ComplaintReview.css';

const ComplaintReview = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/complaints/show/pending-reviews')
            .then(response => response.json())
            .then(data => setComplaints(data.data));
    }, []);

    return (
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
                            <td>{/* Proofs will be added later */}</td>
                            <td>{/* Actions will be added later */}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComplaintReview;
