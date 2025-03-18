import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './EditProject.css'
import { useTheme } from '../../Context/ThemeContext'
const BASE_URL = process.env.REACT_APP_BASE_URL;

const EditProject = () => {
  const { theme } = useTheme();
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState({
    title: '',
    description: '',
    links: '',
    attachments: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newAttachments, setNewAttachments] = useState([])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/projects/pjct/${id}`
        )
        setProject(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const handleInputChange = e => {
    setProject({ ...project, [e.target.name]: e.target.value })
  }

  const handleFileChange = e => {
    setNewAttachments(e.target.files)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', project.title)
    formData.append('description', project.description)
    formData.append('links', project.links)
    Array.from(newAttachments).forEach(file => {
      formData.append('attachments', file)
    })

    try {
      await axios.put(`${BASE_URL}/api/v1/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire('Success', 'Project updated successfully!', 'success')
    } catch (error) {
      Swal.fire('Error', 'Failed to update project. Please try again.', 'error')
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={`editt-project-container ${theme}`}>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            name='title'
            value={project.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            name='description'
            value={project.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='links'>Links</label>
          <input
            type='text'
            id='links'
            name='links'
            value={project.links}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='attachments'>Attachments</label>
          <input
            type='file'
            id='attachments'
            name='attachments'
            onChange={handleFileChange}
            multiple
          />
        </div>
        <button type='submit' className='btnn'>
          Update Project
        </button>
      </form>
    </div>
  )
}

export default EditProject
