import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './EditProfileUser.css';

const EditProfileUser = () => {
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        nic: '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
        phone: '',
        addressline1: '',
        addressline2: '',
        city: '',
        district: '',
        province: '',
        profilePhoto: null,
        profilePhotoUrl: '' // New state to store the photo URL
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('user-name');
        if (name) {
            setUserName(name);
        }
    }, []);

    useEffect(() => {
        const authToken = localStorage.getItem('auth-token');
        if (!authToken) {
            navigate('/login');
        } else {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/v1/users/profile/${id}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    });
                    setFormData({ ...response.data, profilePhotoUrl: response.data.profilePhoto });
                    setProfilePic(response.data.profilePhoto);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'profilePhoto') {
            const file = e.target.files[0];
            if (file) {
                setFormData({ 
                    ...formData, 
                    profilePhoto: file, 
                    profilePhotoUrl: URL.createObjectURL(file) // Update preview
                });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validatePassword = () => {
        const password = formData.password;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(password)) {
            setPasswordError('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = () => {
        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validatePassword();
        validateConfirmPassword();

        if (passwordError || confirmPasswordError) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the errors before submitting.',
            });
            return;
        }

        try {
            const authToken = localStorage.getItem('auth-token');

            // Verify current password
            const verifyResponse = await axios.post(
                `http://localhost:5000/api/v1/users/edit/verify-password`,
                { 
                    currentPassword: formData.currentPassword, 
                    userId: id 
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!verifyResponse || !verifyResponse.data.success) {
                setCurrentPasswordError('Current password is incorrect.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Current password is incorrect.',
                });
                return;
            }

            // Update profile
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (key !== 'profilePhotoUrl') {
                    formDataToSend.append(key, formData[key]);
                }
            }

            await axios.put(`http://localhost:5000/api/v1/users/${id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });

            // Clear localStorage and reset formData
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user-id');
            localStorage.removeItem('user-name');
            setUserName('');

            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully!',
                text: 'Please Login Again',
            }).then(() => {
                window.location.replace('/login');
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setCurrentPasswordError('Current password is incorrect.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Current password is incorrect.',
                });
            } else {
                console.error('Error updating user data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.toString(),
                });
            }
        }
    };

    return (
        <div className="edit-profile">
            <h2 className="edit-profile-title">Edit Your Profile</h2>
            <div className="epu-profile-photo-container">
                <img 
                    src={`http://localhost:5000/${profilePic}` || formData.profilePhotoUrl} 
                    alt="Profile" 
                    className="epu-profile-photo"
                    onClick={() => document.getElementById('profilePhotoInput').click()}
                />
                <div 
                    className="epu-edit-icon-overlay" 
                    onClick={() => document.getElementById('profilePhotoInput').click()}
                >
                    <i className="fas fa-edit"></i> {/* Font Awesome Edit Icon */}
                </div>
                <input 
                    id="profilePhotoInput" 
                    type="file" 
                    name="profilePhoto" 
                    style={{ display: 'none' }} 
                    onChange={handleChange}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="epu-form-container">
                    <div className="epu-form-left">
                        <label className="epu-label">First Name:</label>
                        <input type="text" maxLength="12" name="firstName" value={formData.firstName} onChange={handleChange} readOnly className="epu-input-field" />
                        <label className="epu-label">NIC:</label>
                        <input type="text" name="nic" value={formData.nic} onChange={handleChange} readOnly className="epu-input-field" />
                        <label className="epu-label">Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="epu-input-field" />

                        <label className="epu-label">Current Password:</label>
                        {currentPasswordError && <p className="error-message">{currentPasswordError}</p>}
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="epu-input-field" />

                        <label className="epu-label">New Password:</label>
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={validatePassword} className="epu-input-field" />

                        <label className="epu-label">Confirm New Password:</label>
                        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={validateConfirmPassword} className="epu-input-field" />

                        <label className="epu-label">Phone:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="epu-input-field" />
                    </div>

                    <div className="epu-form-divider"></div>

                    <div className="epu-form-right">
                        <label className="epu-label">Last Name:</label>
                        <input type="text" maxLength="12" name="lastName" value={formData.lastName} onChange={handleChange} readOnly className="epu-input-field" />
                        <label className="epu-label">Address Line 1:</label>
                        <input type="text" name="addressline1" value={formData.addressline1} onChange={handleChange} className="epu-input-field" />
                        <label className="epu-label">Address Line 2:</label>
                        <input type="text" name="addressline2" value={formData.addressline2} onChange={handleChange} className="epu-input-field" />
                        <label className="epu-label">City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="epu-input-field" />
                        <label className="epu-label">District:</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} className="epu-input-field" />
                        <label className="epu-label">Province:</label>
                        <input type="text" name="province" value={formData.province} onChange={handleChange} className="epu-input-field" />
                    </div>
                </div>
                <button type="submit" className="epu-submit-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfileUser;