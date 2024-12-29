import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './EditProject.css';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({
        title: '',
        description: '',
        links: '',
        attachments: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  //  const [newAttachments, setNewAttachments] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/projects/pjct/${id}`);
            setProject(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchProject();
}, [id]);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return <div className="edit-project-container"></div>;
};

export default EditProject;



