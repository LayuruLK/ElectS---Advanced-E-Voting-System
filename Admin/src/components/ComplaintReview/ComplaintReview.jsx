import React from 'react';
import './ComplaintReview.css';

const ComplaintReview = () => {
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
                    {/* Rows will be populated dynamically */}
                </tbody>
            </table>
        </div>
    );
};

export default ComplaintReview;
