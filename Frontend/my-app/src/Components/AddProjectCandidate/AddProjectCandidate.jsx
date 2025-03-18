import axios from 'axios';
import Swal from 'sweetalert2';
import './AddProjectCandidate.css';
import React, { useState } from 'react';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const AddProjectCandidate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [links, setLinks] = useState('');
    const [attachments, setAttachments] = useState([]);
    const userId = localStorage.getItem('user-id')

    const checkIfUserIsCandidate = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/users/profile/${userId}`);
          return response.data.isCandidate;
        } catch (err) {
          Swal.fire('Error', 'Failed to check user status', 'error');
          return false;
        }
      };

    const handleAttachmentChange = (e) => {
        setAttachments([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isCandidate = await checkIfUserIsCandidate();
        // Check if user is a candidate
        
        if (!isCandidate) {
            Swal.fire('Error', "You can't add a project", 'error');
            return;
        }

        const formData = new FormData();
        formData.append('user', userId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('links', links);
        attachments.forEach(file => formData.append('attachments', file));

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/projects/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', 'Project added successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to add project', 'error');
        }
    };
    
    return (
        <div className="add-project-container">
            <form onSubmit={handleSubmit}>
                <h2>Add new Project</h2>
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Links</label>
                    <input 
                        type="url" 
                        value={links}
                        onChange={(e) => setLinks(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Attachments</label>
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleAttachmentChange}
                    />
                </div>
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
};

export default AddProjectCandidate;