import React, { useEffect, useState } from 'react';
import './NICReview.css';
import Review from '../Review/Review';

const NICReview = () => {
    const [users, setUsers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // State to track the clicked image

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/users/pending-verifications')
            .then(response => response.json())
            .then(data => setUsers(data.users));
    }, []);

    const verifyUser = (userId, status) => {
        fetch(`http://localhost:5000/api/v1/users/verify/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isVerified: status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User verification updated successfully');
                setUsers(users.filter(user => user._id !== userId));  // Remove the verified user from list
            }
        });
    };

    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc); // Set the selected image to be displayed in the modal
    };

    const closeImageModal = () => {
        setSelectedImage(null); // Close the modal
    };

    return (
        <>
        <Review/>
        <div className="review-panel">
            <h1 className='headnic'>Pending NIC Verifications</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Photo</th>
                        <th>NIC Front</th>
                        <th>NIC Back</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}<br/>NIC:{user.nic}</td>
                            <td>
                                <img
                                    src={`http://localhost:5000/${user.profilePhoto}`}
                                    alt="Profile_Picture"
                                    onClick={() => openImageModal(`http://localhost:5000/${user.profilePhoto}`)}
                                    className="clickable-image"
                                />
                                
                            </td>
                            <td>
                                <img
                                    src={`http://localhost:5000/${user.nicFront}`}
                                    alt="NIC Front"
                                    onClick={() => openImageModal(`http://localhost:5000/${user.nicFront}`)}
                                    className="clickable-image"
                                />
                            </td>
                            <td>
                                <img
                                    src={`http://localhost:5000/${user.nicBack}`}
                                    alt="NIC Back"
                                    onClick={() => openImageModal(`http://localhost:5000/${user.nicBack}`)}
                                    className="clickable-image"
                                />
                            </td>
                            <td>
                                <button className='btn' onClick={() => verifyUser(user._id, true)}>Approve</button>
                                <br/>
                                <button className='btn' onClick={() => verifyUser(user._id, false)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content">
                        <img src={selectedImage} alt="Zoomed NIC" />
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default NICReview;
