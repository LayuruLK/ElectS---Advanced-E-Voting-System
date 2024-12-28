import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateParty.css';

const UpdateParty = () => {
    const [parties, setParties] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedPartyId, setSelectedPartyId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        abbreviation: '',
        leader: '',
        foundingDate: '',
        website: '',
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
    });
    const [loadingParties, setLoadingParties] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(true);

    // Fetch parties and candidates
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/parties');
                setParties(response.data.parties);
            } catch (error) {
                console.error('Error fetching parties:', error);
                alert('Failed to fetch parties. Please try again later.');
            } finally {
                setLoadingParties(false);
            }
        };

        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/candidates');
                setCandidates(response.data.data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                alert('Failed to fetch candidates. Please try again later.');
            } finally {
                setLoadingCandidates(false);
            }
        };

        fetchParties();
        fetchCandidates();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPartyId) {
            alert('Please select a political party to update.');
            return;
        }

        try {
            const updatedData = { ...formData };
            const response = await axios.put(
                `http://localhost:5000/api/v1/parties/${selectedPartyId}`,
                updatedData
            );
            alert('Political party updated successfully!');
            console.log('Update response:', response.data);
        } catch (error) {
            console.error('Error updating party:', error);
            alert('Failed to update the party. Please check your inputs or try again later.');
        }
    };

    return (
        <div className="update-party">
            <h1 className="headnic">Update Political Party</h1>

            {/* Dropdown to select a political party */}
            <div className="form-group">
                <label htmlFor="partyDropdown">Select a Political Party:</label>
                <select
                    id="partyDropdown"
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                    disabled={loadingParties}
                >
                    <option value="">-- Select a Political Party --</option>
                    {parties.map((party) => (
                        <option key={party._id} value={party._id}>
                            {party.name}
                        </option>
                    ))}
                </select>
                {loadingParties && <p>Loading political parties...</p>}
            </div>

            {selectedPartyId && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
                        <label htmlFor="leader">Leader:</label>
                        <select
                            id="leader"
                            name="leader"
                            value={formData.leader}
                            onChange={handleChange}
                            disabled={loadingCandidates}
                            required
                        >
                            <option value="">-- Select a Leader --</option>
                            {candidates.map((candidate) => (
                                <option key={candidate._id} value={candidate._id}>
                                    {candidate?.user?.name || 'Unknown Candidate'}
                                </option>
                            ))}
                        </select>
                        {loadingCandidates && <p>Loading candidates...</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="foundingDate">Founding Date:</label>
                        <input
                            type="date"
                            id="foundingDate"
                            name="foundingDate"
                            value={formData.foundingDate.split('T')[0]}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
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

                    <button className="btn-update" type="submit">
                        Update Political Party
                    </button>
                </form>
            )}
        </div>
    );
};

export default UpdateParty;
