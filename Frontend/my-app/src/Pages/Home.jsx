import React, { useEffect, useState, useRef } from 'react';
import Welcome from '../Components/Welcome/Welcome';
import Feature from '../Components/Feature/Feature';
import FandQ from '../Components/Fandq/Fandq';
import Webcam from 'react-webcam';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import axios from 'axios';
import './CSS/Home.css';
import ProjectSlides from '../Components/ProjectSlides/ProjectSlides';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Home = () => {
    const [isPhotoExpired, setIsPhotoExpired] = useState(false);
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const webcamRef = useRef(null);

    useEffect(() => {
        const checkPhotoExpiry = async () => {
            const userId = localStorage.getItem('user-id');
            const token = localStorage.getItem('auth-token');

            try {
                const response = await axios.get(`${BASE_URL}/api/v1/users/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = response.data;
                const lastUpdatedDate = new Date(userData.photoUpdatedAt);
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                if (lastUpdatedDate <= oneYearAgo) {
                    setIsPhotoExpired(true);
                }
            } catch (error) {
                console.error('Error checking photo expiry:', error);
                //toast.error('Failed to verify photo expiry.');
            }
        };

        checkPhotoExpiry();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.replace('/login');
    };

    const handlePhotoCapture = () => {
        const photo = webcamRef.current.getScreenshot();
        setCapturedPhoto(photo);
        setIsWebcamOpen(false);
    };

    const handleUpdatePhoto = async () => {
        const userId = localStorage.getItem('user-id');
        const token = localStorage.getItem('auth-token');

        try {
             // Convert base64 to Blob
            const byteString = atob(capturedPhoto.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uintArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
                uintArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('realtimePhoto',blob, 'realtimePhoto.jpg');
            
            await axios.put(`${BASE_URL}/api/v1/users/updatephoto/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Photo updated successfully!');
            setIsPhotoExpired(false);
            setCapturedPhoto(null);
        } catch (error) {
            console.error('Error updating photo:', error);
            toast.error('Failed to update photo. Please try again.');
        }
    };

    return (
        <div>
             <ToastContainer />
            {isPhotoExpired && !capturedPhoto && !isWebcamOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Your Realtime Photo has expired!</h2>
                        <p>Please update it to continue using the system.</p>
                        <div className="modal-actions">
                            <button onClick={handleLogout} className="cancel-button">Later</button>
                            <button onClick={() => setIsWebcamOpen(true)} className="ok-button">Update Now</button>
                        </div>
                    </div>
                </div>
            )}

            {isWebcamOpen && (
                <div className="webcam-container">
                    <Webcam
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="webcam"
                        ref={webcamRef}
                        onUserMediaError={() => toast.error('Webcam not accessible!')}
                    />
                    <button onClick={handlePhotoCapture} className="capture-button">Capture Photo</button>
                </div>
            )}
            
            {capturedPhoto && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Preview Your Photo</h2>
                        <img src={capturedPhoto} alt="Captured" className="photo-preview" />
                        <div className="preview-actions">
                            <button onClick={handleUpdatePhoto} className="ok-button">OK Update This</button>
                            <button onClick={() => {
                                setCapturedPhoto(null); 
                                setIsWebcamOpen(true);
                            }} 
                            className="try-again-button">Try Again</button>
                            <button onClick={handleLogout} className="cancel-button">Later</button>
                        </div>
                    </div>
                </div>
            )}

           

            <Welcome />
            <ProjectSlides/>
            <Feature />
            <FandQ />
        </div>
    );
};

export default Home;
