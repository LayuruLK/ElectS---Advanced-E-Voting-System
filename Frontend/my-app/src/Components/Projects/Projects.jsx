import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Projects.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Projects = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidateProjects = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/projects/${id}`);
                setProjects(response.data.data);
                setFilteredProjects(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateProjects();
    }, [id]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = projects.filter(project =>
            project.title.toLowerCase().includes(term)
        );
        setFilteredProjects(filtered);
    };

    if (loading) return <p className="pro-li-loading">Loading...</p>;
    if (error) return <p className="pro-li-error">Error: {error}</p>;

    return (
        <div className={`pro-li-container ${theme}`}>
            <div className={`pro-li-search-bar-container ${theme}`}>
                <input
                    type="text"
                    className={`pro-li-search-bar ${theme}`}
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {filteredProjects.length > 0 ? (
                <ul className={`pro-li-list ${theme}`}>
                    {filteredProjects.map(project => (
                        <li key={project._id} className={`pro-li-item ${theme}`}>
                            <Link to={`/edit-project/${project._id}`} className="pro-li-link">
                                <h4 className="pro-li-title">{project.title}</h4>
                                <p className="pro-li-description">{project.description}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="pro-li-no-projects">No projects found.</p>
            )}
        </div>
    );
};

export default Projects;
