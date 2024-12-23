import axios from 'axios';
import Swal from 'sweetalert2';
import './AddProjectCandidate.css';
import React, { useState } from 'react';

const AddProjectCandidate = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [links, setLinks] = useState('');

    const checkIfUserIsCandidate = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/users/profile/${userId}`);
          return response.data.isCandidate;
        } catch (err) {
          Swal.fire('Error', 'Failed to check user status', 'error');
          return false;
        }
      };
      return (
        <div className="add-project-container">
            <form>
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
                </div>
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
};


export default AddProjectCandidate;