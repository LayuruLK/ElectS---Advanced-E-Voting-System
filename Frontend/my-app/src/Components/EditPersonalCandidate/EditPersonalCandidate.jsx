import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './EditPersonalCandidate.css';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const EditPersonalCandidate = () => {
    const { theme } = useTheme();
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('user-name');
        if (name) {
            setUserName(name);
        }
    }, []);

    const [formData, setFormData] = useState({
        skills: '',
        objectives: '',
        bio: '',
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
        profilePhoto: null
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('auth-token');
        if (!authToken) {
            navigate('/login');
        } else {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/v1/candidates/user/profile/${id}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    });
                    const { user, ...candidateData } = response.data.data;
                    setFormData({
                        ...candidateData,
                        ...user,
                        profilePhoto: null // Keep this null initially; handle file input separately
                    });
                    setProfilePic(response.data.data.user.profilePhoto);
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
            setFormData({ ...formData, profilePhoto: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validatePassword = () => {
        if (formData.password) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regex.test(formData.password)) {
                setPasswordError('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
                return false;
            }
        }
        setPasswordError('');
        return true;
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
                `${BASE_URL}/api/v1/users/edit/verify-password`,
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


            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            await axios.put(`${BASE_URL}/api/v1/candidates/${id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user-id');
            localStorage.removeItem('user-name');
            setUserName('');
            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully!',
                text: 'Please Login Again',
            }).then(() => {
                navigate('/login', { replace: true });
            });
        } catch (error) {
            console.error('Error updating user data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.toString(),
            });
        }
    };

    return (
        <div className={`edit-profile ${theme}`}>
            <h2 className={`edit-profile-title ${theme}`}>Edit Your Profile</h2>
            <div className="epu-profile-photo-container">
                {profilePic && <img
                    src= {profilePic}
                    alt="Profile"
                    className="epu-profile-photo"
                    onClick={() => document.getElementById('profilePhotoInput').click()}
                />}
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
                    required
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className={`epu-form-container ${theme}`}>
                    <div className={`epu-form-left ${theme}`}>
                        <label className={`epu-label ${theme}`}>First Name:</label>
                        <input type="text" maxLength="12" name="firstName" value={formData.firstName} onChange={handleChange} readOnly className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>NIC:</label>
                        <input type="text" name="nic" value={formData.nic} onChange={handleChange} readOnly className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="epu-input-field" />

                        <label className={`epu-label ${theme}`}>Current Password:</label>
                        {currentPasswordError && <p className="error-message">{currentPasswordError}</p>}
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="epu-input-field" />

                        <label className={`epu-label ${theme}`}>New Password:</label>
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={validatePassword} className="epu-input-field" />

                        <label className={`epu-label ${theme}`}>Confirm New Password:</label>
                        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={validateConfirmPassword} className="epu-input-field" />

                        <label className={`epu-label ${theme}`}>Phone:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="epu-input-field" />

                        <label className={`epu-label ${theme}`}>Objectives:</label>
                        <input type="text" name="objectives" value={formData.objectives} onChange={handleChange} className="epu-input-field" />
                    </div>
                    <div className="epu-form-divider"></div>
                    <div className={`epu-form-right ${theme}`}>
                        <label className={`epu-label ${theme}`}>Last Name:</label>
                        <input type="text" maxLength="12" name="lastName" value={formData.lastName} onChange={handleChange} readOnly className="epu-input-field" />
                        <label className="gender-label">Gender:</label>
                        <div className="gender-options">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={handleChange}
                                    required
                                    disabled
                                />
                                Male
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={handleChange}
                                    required
                                    disabled
                                />
                                Female
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Other"
                                    checked={formData.gender === "Other"}
                                    onChange={handleChange}
                                    required
                                    disabled
                                />
                                Other
                            </label>
                        </div>
                        <label className={`epu-label ${theme}`}>Address Line 1:</label>
                        <input type="text" name="addressline1" value={formData.addressline1} onChange={handleChange} className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>Address Line 2:</label>
                        <input type="text" name="addressline2" value={formData.addressline2} onChange={handleChange} className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>District:</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>Province:</label>
                        <input type="text" name="province" value={formData.province} onChange={handleChange} className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>Skills:</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="epu-input-field" />
                        <label className={`epu-label ${theme}`}>Bio:</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} className="epu-input-field" ></textarea>
                    </div>
                </div>
                <button type="submit" className="epu-submit-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPersonalCandidate;
