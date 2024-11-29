import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        name: "",
        nic: "",
        email: "",
        password: "",
        phone: "",
        addressline1: "",
        addressline2: "",
        city: "",
        district: "",
        province: "",
        profilePhoto: null,
        isCandidate: false,
        skills: [],
        objectives: "",
        bio: "",
        politicalParty: "",
        nicFront: null,
        nicBack: null,
        realtimePhoto: null
    });
  return (
    <div className='loginsignup'>
        <ToastContainer>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="loginsignup-fields">
                        {state === "Sign Up" && (
                            <div className='signup-container'>
                                <div className='form-row'>
                                    <input name='name' value={formData.name} onChange={changeHandler} type="text" placeholder='Your Name' />
                                    <input name='addressline1' value={formData.addressline1} onChange={changeHandler} type="text" placeholder='Address Line 1' />
                                </div>
                                <div className='form-row'>
                                    <input name='phone' value={formData.phone} onChange={changeHandler} type="text" placeholder='Phone Number' />
                                    <input name='addressline2' value={formData.addressline2} onChange={changeHandler} type="text" placeholder='Address Line 2' />
                                </div>
                                <div className='form-row'>
                                    <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Your Email' />
                                </div>
                                <div className="form-row">
                                    <select name='province' value={formData.province} onChange={changeHandler} required>
                                        <option value="" disabled>Select Your Province</option>
                                        {provinces.map((province, index) => (
                                            <option key={index} value={province}>{province}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='form-row'>
                                    <select name='district' value={formData.district} onChange={changeHandler} required>
                                        <option value="" disabled>Select Your District</option>
                                        {(districtOptions[formData.province] || []).map((district, index) => (
                                            <option key={index} value={district}>{district}</option>
                                        ))}
                                    </select>
                                    <select name='city' value={formData.city} onChange={changeHandler} required>
                                        <option value="" disabled>Select Your City</option>
                                        {(cityOptions[formData.district] || []).map((city, index) => (
                                            <option key={index} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    
                                </div>
                                <div className='form-row'>
                                    <div className="upload-section">
                                        <label htmlFor="profilePhoto">Profile Photo (JPG/PNG)</label>
                                        <input name='profilePhoto' onChange={changeHandler} type="file" id="profilePhoto" />
                                        {previewImages.profilePhoto && (
                                            <img src={previewImages.profilePhoto} alt="Profile Preview" className="image-preview" />
                                        )}
                                    </div>
                                    <div className="upload-section">
                                        <label htmlFor="nicFront">NIC Front Side (JPG/PNG)</label>
                                        <input name='nicFront' onChange={changeHandler} type="file" id="nicFront" required />
                                        {previewImages.nicFront && (
                                            <img src={previewImages.nicFront} alt="NIC Front Preview" className="image-preview" />
                                        )}
                                    </div>
                                    <div className="upload-section">
                                        <label htmlFor="nicBack">NIC Back Side (JPG/PNG)</label>
                                        <input name='nicBack' onChange={changeHandler} type="file" id="nicBack" required />
                                        {previewImages.nicBack && (
                                            <img src={previewImages.nicBack} alt="NIC Back Preview" className="image-preview" />
                                        )}
                                    </div>
                                </div>
                                
                                {/*Web Cam*/}
                                <div className='form-row'>
                                    <button
                                        type="button"
                                        className="capture-photo-button"
                                        onClick={() => setShowWebcam(!showWebcam)}
                                    >
                                        {showWebcam ? "Cancel Webcam" : "Capture Real-time Photo"}
                                    </button>
                                </div>
                                {showWebcam && (
                                    <div className="webcam-container">
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            width="100%"
                                            className="webcam-preview"
                                            onUserMediaError={() => {
                                                toast.error('Unable to access the camera. Please check permissions.');
                                            }}
                                            videoConstraints={{
                                                facingMode: "user",
                                            }}
                                        />
                                        <button type="button" onClick={() => {
                                            capturePhoto();
                                           
                                        }} className="capture-button">
                                            Capture Photo
                                        </button>
                                    </div>
                                )}
                                {previewImages.realtimePhoto && (
                                    <div className="form-row">
                                        <img
                                            src={previewImages.realtimePhoto}
                                            alt="Realtime Preview"
                                            className="image-preview"
                                            onChange={changeHandler}
                                        />
                                    </div>
                                )}

                            
                                <div className='form-row'>
                                    <label className='checkbox'>
                                        <input className='checkbox-check' name='isCandidate' checked={formData.isCandidate} onChange={changeHandler} type="checkbox" />
                                        <p className='can'>Are you a Candidate?</p>
                                    </label>
                                </div>
                                {formData.isCandidate && (
                                    <>
                                        <div className='form-row'>
                                            <input name='skills' value={formData.skills.join(', ')} onChange={handleSkillsChange} type="text" placeholder='Skills (comma-separated)' />
                                        </div>
                                        <div className='form-row'>
                                            <input name='objectives' value={formData.objectives} onChange={changeHandler} type="text" placeholder='Objectives (comma-separated)' />
                                        </div>
                                        <div className='form-row'>
                                            <textarea name='bio' value={formData.bio} onChange={changeHandler} placeholder='Bio'></textarea>
                                        </div>
                                        <div className='form-data'>
                                            <select
                                                name="politicalParty"
                                                value={formData.politicalParty}
                                                onChange={handleChange}
                                                required
                                                >
                                                <option value="">Select a Political Party</option>
                                                {parties.map((party) => (
                                                    <option key={party._id} value={party._id}>
                                                    {party.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <div className={state === "Sign Up" ? "login-container" : "full-width"}>
                            <input name='nic' value={formData.nic} onChange={changeHandler} type="text" placeholder='NIC Number' required />
                            <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" required />
                        </div>
                    </div>
                    <button type="submit">Continue</button>
                    {state === "Sign Up" ? (
                        <p className='loginsignup-login'>Already have an account <span onClick={() => { setState("Login") }}>Login here</span></p>
                    ) : (
                        <p className='loginsignup-login'>Create an account <span onClick={() => { setState("Sign Up") }}>Register here</span></p>
                    )}
                    <div className="loginsignup-agree">
                        <input type="checkbox" required />
                        <p>By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.</p>
                    </div>
                </form>
            </div>
        </ToastContainer>
       
    </div>
  )
}

export default LoginSignup
