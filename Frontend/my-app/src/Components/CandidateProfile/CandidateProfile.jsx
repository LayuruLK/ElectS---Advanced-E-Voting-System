import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CandidateProfile.css';
import Complaint from '../Complaint/Complaint';
import { FaUser, FaTasks, FaExclamationCircle, FaFileAlt } from 'react-icons/fa'; // React Icons
import pdfIcon from '../Assests/pdf.png';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { theme } = useTheme();

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
        const [candidateRes, projectsRes, descriptionRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/candidates/user/profile/${id}`),
          axios.get(`${BASE_URL}/api/v1/projects/${id}`),
          axios.get(`${BASE_URL}/api/v1/description/view/${id}`),
        ]);
        setCandidate(candidateRes.data.data);
        setProjects(projectsRes.data.data.filter((project) => project.isReviewed));
        setDescription(descriptionRes.data?.description || "No description available.");
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
  if (!candidate) return <p>No candidate details found.</p>;

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={`candidate-profile ${theme}`}>
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
            src={candidate.user.profilePhoto}
            alt={`${candidate.user.firstName} ${candidate.user.lastName}`}
            onClick={() => openImageModal(candidate.user.profilePhoto)}
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

      <div className="candidate-description">
        {/* <h2 className="candidate-description-h">Description</h2> */}
        <div className="candidate-description-div" dangerouslySetInnerHTML={{ __html: description }}></div>
      </div>

      {/* Projects Section */}
      <div ref={projectsRef} className={`candidate-projects ${theme}`}>
        <h2>Social Works</h2>
        {projects.length > 0 ? (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project._id} className={`project-item ${theme}`}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p><strong>Explore More Details:-</strong></p>
                {project.links && (
                  <a href={project.links} target="_blank" rel="noopener noreferrer">Project Link</a>
                )}
                {project.attachments.length > 0 && (
                  <div className="project-attachments">
                    <p><strong>Attachments:</strong></p>
                    <div className="attachments-container">
                      {project.attachments.slice(0, 3).map((attachment, index) => {
                        const fileUrl = (attachment);
                        const isImage = /\.(jpeg|jpg|png|gif)$/i.test(attachment);
                        const isPdf = /\.pdf$/i.test(attachment);

                        return isImage ? (
                          // Display image thumbnails for photos
                          <img
                            key={index}
                            src={fileUrl}
                            alt={`Attachment ${index + 1}`}
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
                          // Display a generic file icon for other files
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

                    {project.attachments.length > 3 && <p>+{project.attachments.length - 3} more</p>}
                  </div>
                )}

              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
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

      {/* Complaints Section */}
      <div ref={complaintsRef}>
        <Complaint userId={id} />
      </div>
    </div>
  );
};

export default CandidateProfile;
