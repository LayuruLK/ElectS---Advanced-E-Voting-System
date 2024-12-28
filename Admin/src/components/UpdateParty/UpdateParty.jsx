import React, { useState } from 'react';
import './UpdateParty.css';

const UpdateParty = () => {
    const [formData, setFormData] = useState({
        name: '',
        abbreviation: '',
        leader: '',
        foundingDate: '',
        website: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className='update-party'>
            <h1 className='headnic'>Update Political Party</h1>
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="leader">Leader:</label>
                    <input
                        type="text"
                        id="leader"
                        name="leader"
                        value={formData.leader}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="foundingDate">Founding Date:</label>
                    <input
                        type="date"
                        id="foundingDate"
                        name="foundingDate"
                        value={formData.foundingDate}
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
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>
                <button className='btn-update' type="submit">Update Political Party</button>
            </form>
        </div>
    );
};

export default UpdateParty;
