import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import Webcam from 'react-webcam';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/LoginSignup.css';
//import { PoliticalParty } from '../../../../Backend/models/party';

const LoginSignup = () => {
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [people, setPeople] = useState([]);
    const [parties, setParties] = useState([]);
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
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
    const [previewImages, setPreviewImages] = useState({
        profilePhoto: null,
        nicFront: null,
        nicBack: null,
        realtimePhoto: null
    });

    //RealTime Photo
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = useRef(null);

    const capturePhoto = () => {
        if (!webcamRef.current) {
            toast.error('Webcam not initialized. Please refresh the page.');
            return;
        }
    
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                // Convert base64 string to a Blob
                const byteString = atob(imageSrc.split(',')[1]); // Remove base64 header
                const arrayBuffer = new ArrayBuffer(byteString.length);
                const uintArray = new Uint8Array(arrayBuffer);
                for (let i = 0; i < byteString.length; i++) {
                    uintArray[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([uintArray], { type: 'image/jpeg' });
                
                // Create a File from the Blob
                const file = new File([blob], "realtimePhoto.jpg", { type: 'image/jpeg' });
    
                setFormData((prevState) => ({
                    ...prevState,
                    realtimePhoto: file, // Store the file in the state
                }));
    
                setPreviewImages((prevState) => ({
                    ...prevState,
                    realtimePhoto: imageSrc,
                }));
    
                // Simulate a change event for changeHandler
                
                changeHandler({
                    target: {
                        name: 'realtimePhoto',
                        type: 'file',
                        files: [file], // Pass the File object here
                    },
                });

                toast.success('Photo captured successfully!');
                setShowWebcam(false);
            } else {
                toast.error('Failed to capture photo. Please try again.');
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };
    
    
    // Fetch political parties from the Database
    useEffect(() =>{
        const fetchParties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/parties/party');
                setParties(response.data.data);
            } catch (error) {
                swal('Error!', 'Failed to fetch political parties.', 'error');
            }
        };
        fetchParties();
    }, []);


    //Fetch People from the Database
    useEffect(() => {
       const fetchPeople = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/peoples/external-people');
            setPeople(response.data.data);
        } catch (error) {
            swal('Error!', 'Failed to fetch People.', 'error')
        }
       };
       fetchPeople();
    }, []);

    
    const validateNICAndName = (nic, firstName, lastName) => {
        const matchedPerson = people.find(person => person.nic === nic);
    
        if (!matchedPerson) {
            toast.error('This NIC is not registered in the system.');
            return false; // NIC is not valid
        }
    
        if (matchedPerson.firstName !== firstName) {
            toast.error('The entered first name does not match the registered name for this NIC.');
            return false; // Name does not match
        } else {
            if(matchedPerson.lastName !== lastName) {
                toast.error('The entered last name does not match the registered name for this NIC.');
                return false; // Name does not match
            } else {
                return true; // NIC and name are valid
            }
        }    
    };
    
    
    
    const changeHandler = (e) => {
        const { name, type, value, files, checked } = e.target;

        if (type === 'file') {
            if (files && files.length > 0) {
                const file = files[0];
                setFormData({ ...formData, [name]: file });
                setPreviewImages({ ...previewImages, [name]: URL.createObjectURL(file) });
            }
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData({
            ...formData,
            [name]: value,  // Set the value of the selected political party
        });
    };


    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setFormData({ ...formData, skills: skillsArray });
    };


    const validatePassword = () => {
        const password = formData.password;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(password)) {
          setPasswordError(
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
          );
        } else {
          setPasswordError("");
        }
      };
      
      const validateConfirmPassword = () => {
        if (formData.password !== formData.confirmPassword) {
          setConfirmPasswordError("Passwords do not match.");
        } else {
          setConfirmPasswordError("");
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (state === "Login") {
            await login();
        } else {
            if (!validateNICAndName(formData.nic, formData.firstName, formData.lastName)) {
                return; // Stop further execution if NIC or name is invalid
            } else {
                validatePassword();
                validateConfirmPassword();
                if (!passwordError && !confirmPasswordError) {
                    // Proceed with form submission logic
                    console.log("Form submitted:", formData);
                    await signup();
                  } else {
                    console.log("Fix errors before submitting.");
                  }
            }
        }
    };

    const login = async () => {
        console.log("Login Function Executed", { nic: formData.nic, password: formData.password });

        try {
            const response = await fetch('http://localhost:5000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nic: formData.nic, password: formData.password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            localStorage.setItem('auth-token', responseData.token);
            localStorage.setItem('user-id', responseData.user._id);
            localStorage.setItem('user-name', responseData.user.firstName);
            localStorage.setItem('user-isCandidate', responseData.user.isCandidate);
            toast.success("Login successful!");
            window.location.replace("/");

        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Invalid NIC or Password.');
        }
    };

    const signup = async () => {
        console.log("Signup Function Executed", formData);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/users/register', {
                method: 'POST',
                body: formDataToSend,
            });
            console.log(formDataToSend);
            

            const responseData = await response.json();

            if (responseData && responseData.success) {
                toast.success("Signup successful!");
                window.location.replace("/login");
            } else {
                toast.error(responseData.errors || "Signup failed");
            }
        } catch (error) {
            //console.error('Fetch error:', error);
            toast.error('An error occurred during signup. Please try again later.', error);
        }
    };

    const provinces = [
        "Central Province",
        "Eastern Province",
        "North Central Province",
        "Northern Province",
        "North Western Province",
        "Sabaragamuwa Province",
        "Southern Province",
        "Uva Province",
        "Western Province"
    ];

    const districtOptions = {
        "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
        "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
        "North Central Province": ["Anuradhapura", "Polonnaruwa"],
        "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
        "North Western Province": ["Kurunegala", "Puttalam"],
        "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
        "Southern Province": ["Galle", "Matara", "Hambantota"],
        "Uva Province": ["Badulla", "Monaragala"],
        "Western Province": ["Colombo", "Gampaha", "Kalutara"]
    };

    const cityOptions = {
        "Kandy": ["Kandy City", "Gampola", "Peradeniya"],
        "Matale": ["Matale City", "Dambulla", "Naula"],
        "Nuwara Eliya": ["Nuwara Eliya City", "Hatton", "Ambewela"],
        "Batticaloa": ["Batticaloa City", "Kaluwanchikudy", "Eravur"],
        "Ampara": ["Ampara City", "Sammanthurai", "Addalachchenai"],
        "Trincomalee": ["Trincomalee City", "Kuchchaveli", "Muttur"],
        "Anuradhapura": ["Anuradhapura City", "Medawachchiya", "Talawa"],
        "Polonnaruwa": ["Polonnaruwa City", "Dimbulagala", "Galnewa"],
        "Jaffna": ["Jaffna City", "Chavakachcheri", "Point Pedro"],
        "Kilinochchi": ["Kilinochchi City", "Poonakary", "Karachchi"],
        "Mannar": ["Mannar City", "Mannar Island", "Nanattan"],
        "Vavuniya": ["Vavuniya City", "Vavuniya North", "Vavuniya South"],
        "Mullaitivu": ["Mullaitivu City", "Oddusuddan", "Tammiletty"],
        "Kurunegala": ["Kurunegala City", "Maharagama", "Dambadeniya"],
        "Puttalam": ["Puttalam City", "Kebithigollewa", "Nawagaththegama"],
        "Ratnapura": ["Ratnapura City", "Balangoda", "Elapatha"],
        "Kegalle": ["Kegalle City", "Yatiyanthota", "Deraniyagala"],
        "Galle": ["Galle City", "Hikkaduwa", "Ambalangoda"],
        "Matara": ["Matara City", "Weligama", "Hambantota"],
        "Hambantota": ["Hambantota City", "Tangalle", "Tissamaharama"],
        "Badulla": ["Badulla City", "Haliella", "Bandarawela"],
        "Monaragala": ["Monaragala City", "Badalkumbura", "Medagama"],
        "Colombo": ["Colombo City", "Dehiwala", "Moratuwa"],
        "Gampaha": ["Gampaha City", "Minuwangoda", "Veyangoda"],
        "Kalutara": ["Kalutara City", "Beruwala", "Panadura"]
    };

    return (
        <div className='loginsignup'>
            <ToastContainer />
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="loginsignup-fields">
                        {state === "Sign Up" && (
                            <div className='signup-container'>
                                <div className='form-row'>
                                    <input name='firstName' value={formData.firstName} onChange={changeHandler} type="text" placeholder='Your First Name' />
                                    <input name='lastName' value={formData.lastName} onChange={changeHandler} type="text" placeholder='Your Last Name' />
                                </div>
                                <div className='form-row'>
                                    <input name='addressline1' value={formData.addressline1} onChange={changeHandler} type="text" placeholder='Address Line 1' />
                                    <input name='addressline2' value={formData.addressline2} onChange={changeHandler} type="text" placeholder='Address Line 2' />
                                </div>
                                <div className="form-row">
                                <input name='phone' value={formData.phone} onChange={changeHandler} type="text" placeholder='Phone Number' />
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
                                    <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Your Email' />
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
                            {passwordError && <p className="error-message">{passwordError}</p>}
                            <input
                                name="password"
                                value={formData.password}
                                onChange={changeHandler}
                                type="password"
                                placeholder="Password"
                                required
                                onBlur={validatePassword} // Validate password on blur
                            />
                            
                            {confirmPasswordError && (
                                <p className="error-message">{confirmPasswordError}</p>
                            )}
                            {state === "Sign Up" && (
                                <input
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={changeHandler}
                                type="password"
                                placeholder="Confirm Password"
                                required
                                onBlur={validateConfirmPassword} // Validate confirm password on blur
                                />
                            )}
                            
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
        </div>
    );
};

export default LoginSignup;
