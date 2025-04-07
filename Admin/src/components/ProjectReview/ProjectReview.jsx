import React, { useEffect, useState } from 'react';
import './ProjectReview.css';
import Review from '../Review/Review';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProjectReview = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/v1/projects/show/pending-reviews`)
            .then(response => response.json())
            .then(data => setProjects(data.data));
    }, []);

    const reviewProject = (projectId, isReviewed, reviewComments) => {
        fetch(`${BASE_URL}/api/v1/projects/review/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isReviewed, reviewComments })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Complaint review updated successfully');
                setProjects(projects.filter(project => project._id !== projectId)); // Remove reviewed complaint
            }
        });
    };

    return (
      <>
        <Review/>
        <div className="review-panel">
            <h1 className='headpjct'>Pending Projects Reviews</h1>
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
                    {projects.map(project => (
                        <tr key={project._id}>
                            <td>{project.user.firstName} {project.user.lastName}</td>
                            <td>{project.title}</td>
                            <td>{project.description}</td>
                            <td>
                                {project.attachments.map((attachment, index) => (
                                    <a key={index} href={attachment} target="_blank" rel="noreferrer">
                                        View Proof {index + 1} <br/>
                                    </a>
                                ))}
                            </td>
                            <td>
                                <button className="btn" onClick={() => reviewProject(project._id, true, 'Complaint approved')}>Approve</button>
                                <button className="btn" onClick={() => reviewProject(project._id, false, 'Complaint rejected')}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default ProjectReview;
