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
    const [newAttachments, setNewAttachments] = useState([]);
};
