import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Projects.css'; // Import the CSS file for styling
import HomeSideBar from '../HomeSideBar/HomeSideBar';

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
            const response = await axios.get('http://localhost:5000/api/v1/projects/all'); // Adjust the API endpoint if needed
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
              await axios.delete(`http://localhost:5000/api/v1/projects/${projectId}`); // Adjust the API endpoint if needed
              setProjects(projects.filter(project => project._id !== projectId)); // Remove the project from the list
              setFilteredProjects(filteredProjects.filter(project => project._id !== projectId)); // Update the filtered list as well
              Swal.fire('Deleted!', 'The project has been deleted.', 'success');
            } catch (err) {
              Swal.fire('Error!', 'There was an issue deleting the project.', 'error');
            }
          }
        });
      };





};

export default Projects;
