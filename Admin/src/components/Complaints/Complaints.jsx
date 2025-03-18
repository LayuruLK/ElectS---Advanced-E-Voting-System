import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Complaints.css'; // Import the CSS file for styling
import HomeSideBar from '../HomeSideBar/HomeSideBar';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    username: '',
    title: '',
    isReviewed: '', // For filtering complaints by review status
  });

  useEffect(() => {
    // Fetch all complaints from the backend
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/complaints`);
        const complaintData = response.data || [];
        setComplaints(complaintData);
        setFilteredComplaints(complaintData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    const filtered = complaints.filter((complaint) => {
      const usernameMatch = filters.username
        ? complaint.user?.firstName?.toLowerCase().includes(filters.username.toLowerCase())
        : true;
      const titleMatch = filters.title
        ? complaint.title?.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      const reviewStatusMatch = filters.isReviewed
        ? complaint.isReviewed.toString() === filters.isReviewed
        : true;
      return usernameMatch && titleMatch && reviewStatusMatch;
    });
  
    setFilteredComplaints(filtered);
  }, [filters, complaints]);
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDelete = (complaintId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this complaint!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${BASE_URL}/api/v1/complaints/${complaintId}`);
          if (response.status === 200) {
            setComplaints((prevComplaints) =>
              prevComplaints.filter((complaint) => complaint._id !== complaintId)
            );
            Swal.fire('Deleted!', 'The complaint has been deleted.', 'success');
          }
        } catch (error) {
          Swal.fire('Error!', 'There was an issue deleting the complaint.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      <div className="complaints-container">
        <h1 className="title-complaints">All Complaints</h1>
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
          <select
            name="isReviewed"
            value={filters.isReviewed}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Review status</option>
            <option value="true">Reviewed</option>
            <option value="false">Pending Review</option>
          </select>
        </div>

        {filteredComplaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div className="complaints-list">
            {filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                <h2>{complaint.title}</h2>
                <p>
                  <strong>User:</strong> {complaint.user ? `${complaint.user.firstName} ${complaint.user.lastName}` : 'N/A'}
                </p>
                <p>
                  <strong>Candidate:</strong> {complaint.candidate ? `${complaint.candidate.user.firstName} ${complaint.candidate.user.lastName}` : 'N/A'}
                </p>
                <p>
                  <strong>Description:</strong> {complaint.description}
                </p>
                {complaint.proofs.length > 0 && (
                  <p>
                    <strong>Proofs:</strong>
                    <ul>
                      {complaint.proofs.map((proof, index) => (
                        <li key={index}>
                          <a href={`${BASE_URL}/${proof}`} target="_blank" rel="noopener noreferrer">
                            Proof {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </p>
                )}
                <p>
                  <strong>Status:</strong> {complaint.isReviewed ? 'Reviewed' : 'Pending'}
                </p>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(complaint._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )
        }
      </div >
    </div >
  );
};

export default Complaints;
