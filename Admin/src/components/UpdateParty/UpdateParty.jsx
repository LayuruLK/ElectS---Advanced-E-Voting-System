import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateParty.css'
import ElectionSideBar from '../ElectionSideBar/ElectionSideBar';
import Party from '../Party/Party';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateParty = () => {
    const [parties, setParties] = useState([]);
    const [selectedPartyId, setSelectedPartyId] = useState('');
    const [partyDetails, setPartyDetails] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        abbreviation: '',
        logo: null,
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

    // Fetch political parties for the dropdown
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/parties`);
                setParties(response.data.parties);
            } catch (error) {
                console.error('Error fetching political parties:', error);
                alert('Failed to fetch political parties.');
            }
        };

        fetchParties();
    }, []);

    // Fetch candidates for the leader dropdown
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/candidates`);
                setCandidates(response.data.data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                alert('Failed to fetch candidates.');
            }
        };

        fetchCandidates();
    }, []);

    // Fetch details of the selected party
    useEffect(() => {
        if (selectedPartyId) {
            const fetchPartyDetails = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/v1/parties/${selectedPartyId}`);
                    setPartyDetails(response.data.party);

                    // Pre-fill the form with fetched data
                    setFormData({
                        name: response.data.party.name,
                        abbreviation: response.data.party.abbreviation,
                        leader: response.data.party.leader,
                        foundingDate: response.data.party.foundingDate,
                        headquarters: response.data.party.headquarters,
                        contactDetails: response.data.party.contactDetails,
                        website: response.data.party.website,
                    });
                } catch (error) {
                    console.error('Error fetching political party details:', error);
                    alert('Failed to fetch political party details.');
                }
            };

            fetchPartyDetails();
        }
    }, [selectedPartyId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Nested fields (e.g., headquarters.addressLine1)
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle logo file upload
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            logo: e.target.files[0],
        }));
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === 'logo' && formData[key]) {
                    updatedData.append(key, formData[key]);
                } else if (typeof formData[key] === 'object') {
                    updatedData.append(key, JSON.stringify(formData[key]));
                } else {
                    updatedData.append(key, formData[key]);
                }
            });

            await axios.put(`${BASE_URL}/api/v1/parties/${selectedPartyId}`, updatedData);
            alert('Political party updated successfully!');
        } catch (error) {
            console.error('Error updating political party:', error);
            alert('Failed to update the political party.');
        }
    };

    return (
        <>
        <Party/>
        <div className='update-party'>
            <h1 className='headnic'>Update Political Party</h1>

            {/* Dropdown to select political party */}
            <div>
                <label htmlFor="partyDropdown">Select a Political Party to Update:</label>
                <select
                    id="partyDropdown"
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                >
                    <option value="">-- Select a Political Party --</option>
                    {parties.map((party) => (
                        <option key={party._id} value={party._id}>
                            {party.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedPartyId && (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="abbreviation">Abbreviation:</label>
                        <input
                            type="text"
                            id="abbreviation"
                            name="abbreviation"
                            value={formData.abbreviation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="logo">Logo:</label>
                        <input
                            type="file"
                            id="logo"
                            name="logo"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="leader">Leader:</label>
                        <select
                            id="leader"
                            name="leader"
                            value={formData.leader}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select a Leader --</option>
                            {candidates.map((candidate) => (
                                <option key={candidate._id} value={candidate._id}>
                                    {candidate?.user?.name || 'Unknown Candidate'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="foundingDate">Founding Date:</label>
                        <input
                            type="date"
                            id="foundingDate"
                            name="foundingDate"
                            value={formData.foundingDate.split('T')[0]} // Format date for input
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="headquarters.addressLine1">Headquarters Address Line 1:</label>
                        <input
                            type="text"
                            id="headquarters.addressLine1"
                            name="headquarters.addressLine1"
                            value={formData.headquarters.addressLine1}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contactDetails.email">Contact Email:</label>
                        <input
                            type="email"
                            id="contactDetails.email"
                            name="contactDetails.email"
                            value={formData.contactDetails.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="website">Website:</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={formData.website || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <button className='btn-update' type="submit">Update Political Party</button>
                </form>
            )}
        </div>
        </>
    );
};

export default UpdateParty;
