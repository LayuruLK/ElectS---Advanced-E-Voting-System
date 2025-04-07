import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Projects.css'; // Import the CSS file for styling
import HomeSideBar from '../HomeSideBar/HomeSideBar';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    username: '',
    title: '',
  });

  useEffect(() => {
    // Fetch all projects from the backend
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/projects/all`); // Adjust the API endpoint if needed
        const projectData = response.data.data || [];
        setProjects(projectData);
        setFilteredProjects(projectData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on the filters
    const filtered = projects.filter((project) => {
      const usernameMatch = filters.username
        ? project.user.firstName?.toLowerCase().includes(filters.username.toLowerCase())
        : true;
      const titleMatch = filters.title
        ? project.title?.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      return usernameMatch && titleMatch;
    });

    setFilteredProjects(filtered);
  }, [filters, projects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDelete = (projectId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/api/v1/projects/${projectId}`); // Adjust the API endpoint if needed
          setProjects(projects.filter(project => project._id !== projectId)); // Remove the project from the list
          setFilteredProjects(filteredProjects.filter(project => project._id !== projectId)); // Update the filtered list as well
          Swal.fire('Deleted!', 'The project has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error!', 'There was an issue deleting the project.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      <div className="projects-container">
        <h1 className='title-projects'>All Projects</h1>
        {/* Filter Inputs */}
        <div className="filters">
          <input
            type="text"
            name="username"
            placeholder="Filter by username"
            value={filters.username}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="text"
            name="title"
            placeholder="Filter by title"
            value={filters.title}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="projects-list">
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-card">
                <h2>{project.title}</h2>
                <p>
                  <strong>Candidate:</strong> {project.user.firstName} {project.user.lastName}
                </p>
                <p>
                  <strong>Description:</strong> {project.description}
                </p>
                {project.links && (
                  <p>
                    <strong>Links:</strong>{' '}
                    <a
                      href={project.links}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.links}
                    </a>
                  </p>
                )}
                <p>
                  <strong>Attachments:</strong>
                </p>
                <ul>
                  {project.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >{`Attachment ${index + 1}`}</a>
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Reviewed:</strong> {project.isReviewed ? 'Yes' : 'No'}
                </p>
                {/* Delete Button */}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
