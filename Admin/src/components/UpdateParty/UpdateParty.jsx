import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateParty.css';

const UpdateParty = () => {
    const [parties, setParties] = useState([]);
    const [candidates, setCandidates] = useState([]);
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

    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/parties');
                setParties(response.data.parties);
            } catch (error) {
                console.error('Error fetching parties:', error);
            }
        };

        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/candidates');
                setCandidates(response.data.data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
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

    return (
        <div className='update-party'>
            <h1 className='headnic'>Update Political Party</h1>
            <form>
                {/* Add the dropdown for selecting political parties */}
                <div>
                    <label htmlFor="partyDropdown">Select Political Party:</label>
                    <select id="partyDropdown">
                        <option value="">-- Select a Political Party --</option>
                        {parties.map((party) => (
                            <option key={party._id} value={party._id}>
                                {party.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="leader">Leader:</label>
                    <select id="leader" name="leader" value={formData.leader} onChange={handleChange}>
                        <option value="">-- Select a Leader --</option>
                        {candidates.map((candidate) => (
                            <option key={candidate._id} value={candidate._id}>
                                {candidate.user.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Add other fields */}
            </form>
        </div>
    );
};

export default UpdateParty;
