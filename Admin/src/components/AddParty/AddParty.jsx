import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert
import './AddParty.css'; // Ensure you have corresponding styling
import Party from '../Party/Party';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddParty = () => {
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    leader: '',
    foundingDate: '',
    headquarters: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      province: '',
    },
    contactDetails: {
      email: '',
      phone: '',
    },
    website: '',
  });
  const [logo, setLogo] = useState(null); // To store the logo image
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for submissions

  // Fetch candidates from the server
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/candidates/`);
        if (response.data && response.data.data) {
          setCandidates(response.data.data);
        } else {
          swal('Error!', 'Unexpected response format. Failed to fetch candidates.', 'error');
        }
      } catch (error) {
        swal('Error!', 'Failed to fetch candidates. Please check your connection.', 'error');
      }
    };
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        swal('Error!', 'Logo file size must be less than 2MB.', 'error');
        return;
      }
      setLogo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logo) {
      swal('Error!', 'Please upload a logo for the party.', 'error');
      return;
    }

    setLoading(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('logo', logo);
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('abbreviation', formData.abbreviation);
    formDataToSubmit.append('leader', formData.leader);
    formDataToSubmit.append('foundingDate', formData.foundingDate);
    formDataToSubmit.append('headquarters', JSON.stringify(formData.headquarters));
    formDataToSubmit.append('contactDetails', JSON.stringify(formData.contactDetails));
    formDataToSubmit.append('website', formData.website);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/parties`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      swal('Success!', response.data.message || 'Party added successfully!', 'success');
      setFormData({
        name: '',
        abbreviation: '',
        leader: '',
        foundingDate: '',
        headquarters: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          district: '',
          province: '',
        },
        contactDetails: {
          email: '',
          phone: '',
        },
        website: '',
      });
      setLogo(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add the party. Please try again.';
      swal('Error!', errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Party />
      <div className="add-party">
        <div className="form-container">
          <h1>Add New Party</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Party Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="abbreviation"
              placeholder="Party Abbreviation"
              value={formData.abbreviation}
              onChange={handleChange}
              required
            />
            <select
              name="leader"
              value={formData.leader}
              onChange={handleChange}
              
            >
              <option value="">Select a Leader</option>
              {candidates.map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate?.user?.firstName || 'Unknown Candidate'} {candidate?.user?.lastName}
                </option>
              ))}
            </select>
            <h4>Founded Date</h4>
            <input
              type="date"
              name="foundingDate"
              value={formData.foundingDate}
              onChange={handleChange}
              required
            />
            <h4>Headquarters</h4>
            <input
              type="text"
              name="headquarters.addressLine1"
              placeholder="Address Line 1"
              value={formData.headquarters.addressLine1}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="headquarters.addressLine2"
              placeholder="Address Line 2 (Optional)"
              value={formData.headquarters.addressLine2}
              onChange={handleChange}
            />
            <input
              type="text"
              name="headquarters.city"
              placeholder="City"
              value={formData.headquarters.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="headquarters.district"
              placeholder="District"
              value={formData.headquarters.district}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="headquarters.province"
              placeholder="Province"
              value={formData.headquarters.province}
              onChange={handleChange}
              required
            />
            <h4>Contact Details</h4>
            <input
              type="email"
              name="contactDetails.email"
              placeholder="Email"
              value={formData.contactDetails.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="contactDetails.phone"
              placeholder="Phone"
              value={formData.contactDetails.phone}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="website"
              placeholder="Website URL"
              value={formData.website}
              onChange={handleChange}
            />
            <h4>Logo</h4>
            <input
              type="file"
              name="logo"
              onChange={handleLogoChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Party'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddParty;
