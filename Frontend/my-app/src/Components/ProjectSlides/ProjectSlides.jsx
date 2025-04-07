import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectSlides.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ProjectSlides = () => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/projects/all`);
        const sortedProjects = response.data?.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date in descending order
          .slice(0, 5); // Get the latest 5 projects

        if (sortedProjects.length === 0) {
          throw new Error('No projects found.');
        }
        setProjects(sortedProjects);
        setError(null); // Clear previous errors if any
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0 || isHovered) return;

    // Slide change interval (every 7 seconds)
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 5000); // 7 seconds per project

    return () => clearInterval(slideInterval);
  }, [projects, isHovered]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const isImage = (filePath) => {
    // Use file extensions or MIME types to validate image
    const validImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return validImageTypes.some((type) => filePath.toLowerCase().endsWith(type));
  };

  return (
    <div className={`project-slides-container ${theme}`}>
      {error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : projects.length > 0 ? (
        <div
          className="project-slide-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="project-slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {projects.map((project, index) => (
              <div key={index} className={`project-slide ${theme}`}>
                <h2>{project?.title || 'No title available'}</h2>
                <h4>{project?.user?.firstName} {project?.user?.lastName}</h4>
                <p>{project?.description || 'No description available'}</p>
                {project?.attachments?.length > 0 && (
                  <div className="project-image">
                    {project.attachments.map((attachment, idx) => (
                      isImage(attachment) && (
                        <img
                          key={idx}
                          src={attachment}
                          alt="Project"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-image.jpg'; // Fallback image
                          }}
                        />
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="loading-message">Loading projects...</p>
      )}

      {/* Arrow Navigation */}
      {projects.length > 0 && (
        <div className="navigation-arrows">
          <button className="prev-arrow" onClick={handlePrevious} aria-label="Previous Project">
            <FaArrowLeft size={30} />
          </button>
          <button className="next-arrow" onClick={handleNext} aria-label="Next Project">
            <FaArrowRight size={30} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSlides;
