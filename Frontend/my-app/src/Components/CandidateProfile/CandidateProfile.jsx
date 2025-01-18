import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CandidateProfile.css';
import Complaint from '../Complaint/Complaint';
import { FaUser, FaTasks, FaExclamationCircle } from 'react-icons/fa'; // React Icons

const CandidateProfile = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // References for sections
    const personalDetailsRef = useRef(null);
    const projectsRef = useRef(null);
    const complaintsRef = useRef(null);
  
    // Scroll to specific section
    const scrollToSection = (ref) => {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const [candidateRes, projectsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/v1/candidates/user/profile/${id}`),
                    axios.get(`http://localhost:5000/api/v1/projects/${id}`),
                ]);
                setCandidate(candidateRes.data.data);
                setProjects(projectsRes.data.data.filter((project) => project.isReviewed)); 
            } catch (err) {
                setError(err.message);   
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!candidate) return <p>No Candidate Details Found.</p>;

    return (
        <div className="candidate-profile">
          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button className="navigation-button" onClick={() => scrollToSection(personalDetailsRef)}>
              <FaUser /> 
            </button>
            <button className="navigation-button" onClick={() => scrollToSection(projectsRef)}>
              <FaTasks /> 
            </button>
            <button className="navigation-button" onClick={() => scrollToSection(complaintsRef)}>
              <FaExclamationCircle /> 
            </button>
          </div>

          {/* Personal Details Section */}
          <div ref={personalDetailsRef} className="candidate-header">
             <h1 className="candidate-name">{candidate.user.firstName} {candidate.user.lastName}</h1>
             <div className="candidate-photo">
               <img
                 src={`http://localhost:5000/${candidate.user.profilePhoto}`}
                 alt={`${candidate.user.firstName} ${candidate.user.lastName}`}
               />
             </div>
          </div>

          <div className="candidate-details">
            <p><strong>Email:</strong> {candidate.user.email}</p>
            <p><strong>District:</strong> {candidate.user.district}</p>
            <p><strong>Skills:</strong> {candidate.skills}</p>
            <p><strong>Objectives:</strong> {candidate.objectives}</p>
            <p><strong>Bio:</strong> {candidate.bio}</p>
          </div>

          {/* Projects Section */}
          <div ref={projectsRef} className="candidate-projects">
            <h2>Socail Works</h2>
            {projects.length > 0 ? (
             <ul className="project-list">
               {projects.map((project) => (
                 <li key={project._id} className="project-item">
                   <h4>{project.title}</h4>
                   <p>{project.description}</p>
                   {project.links && (
                     <a href={project.links} target="_blank" rel="noopener noreferrer">Project Link</a>
                   )}
                   {project.attachments.length > 0 && (
                     <div className="project-attachments">
                       <p><strong>Attachments:</strong></p>
                       {project.attachments.map((attachment, index) => (
                         <a
                           key={index}
                           href={`http://localhost:5000/${attachment}`}
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
          <p>No projects found.</p>
        )}
      </div>

      {/* Complaints Section */}
      <div ref={complaintsRef}>
        <Complaint userId={id} />
      </div>
    </div>
    );
};


export default CandidateProfile;
