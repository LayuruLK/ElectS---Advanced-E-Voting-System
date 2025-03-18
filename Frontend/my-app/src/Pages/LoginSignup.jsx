import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import Webcam from 'react-webcam';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/LoginSignup.css';
import { Link } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_BASE_URL;
//import { PoliticalParty } from '../../../../Backend/models/party';

const LoginSignup = () => {
    const [nicError, setNicError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [people, setPeople] = useState([]);
    const [parties, setParties] = useState([]);
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        nic: "",
        gender: "",
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
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/parties/party`);
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
                const response = await axios.get(`${BASE_URL}/api/v1/peoples/external-people`);
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
            if (matchedPerson.lastName !== lastName) {
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

    const validateNIC = () => {
        let nic = formData.nic.toLowerCase(); 
        const regex = /^(?:\d{12}|\d{9}[vx])$/; 
    
        if (!regex.test(nic)) {
            setNicError("Invalid NIC. Use 12 digits or 9 digits followed by 'v' or 'x'.");
        } else {
            setNicError("");
        }
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
            let lowercaseNic = formData.nic.toLowerCase();
            const response = await fetch(`${BASE_URL}/api/v1/users/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nic: lowercaseNic, password: formData.password }),
            });

            // Check if response is OK
            if (!response.ok) {
                const errorResponse = await response.text(); // Read the error message
                throw new Error(errorResponse);
            }

            const responseData = await response.json();

            // Save user data to localStorage
            localStorage.setItem('auth-token', responseData.token);
            localStorage.setItem('user-id', responseData.user._id);
            localStorage.setItem('user-name', responseData.user.firstName);
            localStorage.setItem('user-isCandidate', responseData.user.isCandidate);
            toast.success("Login successful!");
            window.location.replace("/");
        } catch (error) {
            console.error('Fetch error:', error.message);

            // Display specific error messages
            if (error.message === 'User is not verified yet. Please wait for admin approval.') {
                toast.error('Your account has not been verified yet. Please wait for admin approval.');
            } else if (error.message === 'The user not found') {
                toast.error('No account found with this NIC.');
            } else if (error.message === 'Password is wrong') {
                toast.error('Invalid NIC or Password.');
            } else {
                toast.error('Invalid NIC or Password.');
            }
        }
    };


    const signup = async () => {
        console.log("Signup Function Executed", formData);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await fetch(`${BASE_URL}/api/v1/users/register`, {
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
        "Kandy": ["Kandy City", "Gampola", "Peradeniya", "Minipe", "Udadumbara", "Medadumbara", "Kundasale", "Panvila", "Pathadumbara", "Akurana", "Pujapitiya", "Thumpane", "Hatharaliyadda", "Harispattuwa", "Yatinuwara", "Udunuwara", "Pathahewaheta", "Deltota", "Doluwa", "Udapalatha", "Ganga Ihala Korale", " Pasbage Korale"],
        "Matale": ["Matale", "Dambulla", "Galewela", "Ukuwela", "Rattota", "Pallepola", "Naula", "Sigiriya", "Wilgamuwa", "Yatawatta", "Ambanganga Korale", "Laggala-Pallegama"],
        "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Talawakelle", "Haputale", "Kotagala", "Ragala", "Watawala", "Bogawantalawa", "Pundaluoya", "Ginigathhena", "Maskeliya", "Lindula", "Walapane", "Ambewela", "Labukele"],
        "Batticaloa": ["Batticaloa", "Eravur", "Kattankudy", "Valachchenai", "Kaluwanchikudy", "Vakarai", "Oddamavadi", "Chenkaladi", "Vellavely", "Ampilanthurai", "Kiran", "Paddiruppu", "Thimilathiu", "Navalady", "Palamunai", "Arayampathy"],
        "Ampara": ["Ampara", "Kalmunai", "Sainthamaruthu", "Akkaraipattu", "Sammanthurai", "Dehiattakandiya", "Uhana", "Damana", "Pottuvil", "Thirukkovil", "Lahugala", "Mahaoya", "Navithanveli", "Irakkamam", "Addalaichenai", "Nintavur", "Karaitivu", "Alayadiwembu"],
        "Trincomalee": ["Trincomalee", "Kinniya", "Muttur", "Kantalai", "Seruwila", "Thampalakamam", "Pulmoddai", "China Bay", "Nilaveli", "Kuchchaveli", "Gomarankadawala", "Morawewa", "Verugal"],
        "Anuradhapura": ["Anuradhapura", "Kekirawa", "Medawachchiya", "Thambuttegama", "Mihintale", "Nochchiyagama", "Galenbindunuwewa", "Eppawala", "Kahatagasdigiliya", "Horowpathana", "Rambewa", "Padaviya", "Talawa", "Rajanganaya", "Halmillawetiya", "Mahailuppallama"],
        "Polonnaruwa": ["Polonnaruwa", "Kaduruwela", "Hingurakgoda", "Medirigiriya", "Dimbulagala", "Thamankaduwa", "Welikanda", "Elahera", "Giritale", "Palugasdamana", "Aralaganwila", "Jayanthipura", "Manampitiya"],
        "Jaffna": ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur", "Valvettithurai", "Kopay", "Karainagar", "Tellippalai", "Chunnakam", "Kayts", "Velanai", "Delft", "Mandaitivu", "Pungudutivu", "Atchuvely", "Mallakam", "Uduvil", "Kodikamam"],
        "Kilinochchi": ["Kilinochchi", "Pallai", "Paranthan", "Karachchi", "Mulliyan", "Uruthirapuram", "Pooneryn", "Dharmapuram", "Kanakapuram", "Veravil", "Vaddakachchi", "Ananthapuram", "Murukandy", "Ambalnagar"],
        "Mannar": ["Mannar", "Murunkan", "Pesalai", "Madhu", "Nanattan", "Vidathaltivu", "Thalaimannar", "Mullikulam", "Pallimunai", "Sillalai", "Arippu", "Periya Karisal", "Vankalai", "Silavathurai"],
        "Vavuniya": ["Vavuniya", "Cheddikulam", "Nedunkeni", "Omanthai", "Puliyankulam", "Pampaimadu", "Parayanalankulam", "Settikulam", "Mamaduwa", "Kokeliya", "Kandasamy Nagar", "Iratperiyakulam"],
        "Mullaitivu": ["Mullaitivu", "Puthukkudiyiruppu", "Oddusuddan", "Thunukkai", "Maritimepattu", "Vellamullivaikkal", "Silavathurai", "Karupaddamurippu", "Udayarkaddu", "Ampalavanpokkanai", "Visuvamadu", "Mallavi", "Mullivaikkal"],
        "Kurunegala": ["Kurunegala City", "Giribawa", "Dambadeniya", "Galgamuwa", "Ehetuwewa", "Ambanpola", "Kotavehera", "Polpithigama", "Maho", "Nikaweratiya", "Rasnayakapura", "Bingiriya", " Panduwasnuwara West", "Kobeigane", "Wariyapola", "Ganewatta", "Ibbagamuwa", "Rideegama", "Udubaddawa", "Kuliyapitiya West", " Kuliyapitiya East", " Panduwasnuwara East", "Bamunakotuwa", "Weerambugedara", "Maspotha", "Mallawapitiya", "Mawathagama", "Polgahawela", "Narammala", "Alawwa", "Pannala"],
        "Puttalam": ["Puttalam City", "Kebithigollewa", "Nawagaththegama", "Vanathawilluwa", "Karuwalagaswewa", "Kalpitiya", "Anamaduwa", "Mundel", "Mahakumbukkadawala", "Pallama", "Arachchikattuwa", "Chilaw", "Madampe", "Mahawewa", "Nattandiya", "Wennappuwa", "Dankotuwa"],
        "Ratnapura": ["Ratnapura City", "Balangoda", "Elapatha", "Eheliyagoda", "Kuruvita", "Kiriella", "Ayagama", "Imbulpe", "Pelmadulla", "Opanayake", "Nivithigala", "Kahawatta", "Godakawela", "Weligepola", "Kolonna", "Embilipitiya", "Kalawana", "Weligepola"],
        "Kegalle": ["Kegalle City", "Yatiyanthota", "Deraniyagala", "Rambukkana", "Mawanella", "Galigamuwa", "Warakapola", "Aranayaka", "Bulathkohupitiya", "Ruwanwella", "Dehiovita"],
        "Galle": ["Galle City", "Hikkaduwa", "Ambalangoda", "Bentota", "Balapitiya", "Karandeniya", "Elpitiya", "Niyagama", "Thawalama","Neluwa", "Welivitiya-Divithura", "Gonapeenuwala", "Baddegama", "Nagoda", " Bope-Poddala", "Yakkalamulla", " Galle Four Gravets", "Akmeemana", "Imaduwa", "Habaraduwa"],
        "Matara": ["Matara City", "Weligama", "Dickwella", "Devinuwara", "Matara Four Gravets", "Thihagoda", " Kirinda Puhulwella", "Hakmana", "Kamburupitiya", "Malimbada", "Welipitiya", "Akuressa", "Athuraliya", "Mulatiyana", "Pitabeddara", "Pasgoda", "Kotapola"],
        "Hambantota": ["Hambantota City", "Tangalle", "Tissamaharama", "Lunugamvehera", "Sooriyawewa", "Ambalantota", "Angunakolapelessa", "Katuwana", "Walasmulla", "Weeraketiya", "Okewela", "Beliatta"],
        "Badulla": ["Badulla City", "Haliella", "Bandarawela", "Mahiyanganaya", "Rideemaliyadda", "Kandaketiya", "Meegahakivula", "Soranathota", "Lunugala", " Uva Paranagama", "Welimada", "Haputale", "Ella", "Passara", "Haldummulla"],
        "Monaragala": ["Monaragala City", "Badalkumbura", "Medagama", "Madulla", "Bibile", "Siyambalanduwa", "Buttala", "Wellawaya", "Katharagama", "Thanamalvila", "Sevanagala"],
        "Colombo": ["Colombo City", "Dehiwala", "Moratuwa", "Kolonnawa", "Kaduwela", "Seethawaka", "Padukka", "Homagama", "Kesbewa", "Ratmalana", "Maharagama", " Sri Jayawardanapura Kotte", "Thimbirigasyaya"],
        "Gampaha": ["Gampaha City", "Minuwangoda", "Veyangoda", "Negombo", "Divulapitiya", "Mirigama", "Attanagalla", "Katana", "Ja-Ela", "Wattala", "Mahara", "Kelaniya", "Biyagama", "Dompe"],
        "Kalutara": ["Kalutara City", "Beruwala", "Panadura", "Bandaragama", "Horana", "Ingiriya", "Millaniya", "Madurawala", "Bulathsinhala", "Dodangoda", "Agalawatta", "Mathugama", "Palindanuwara","Walallavita"]
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
                                    <label className="re-gender-label">Gender:</label>
                                    <div className="re-gender-options">
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formData.gender === "Male"}
                                                onChange={changeHandler}
                                                required
                                            />
                                            Male
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formData.gender === "Female"}
                                                onChange={changeHandler}
                                                required
                                            />
                                            Female
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Other"
                                                checked={formData.gender === "Other"}
                                                onChange={changeHandler}
                                                required
                                            />
                                            Other
                                        </label>
                                    </div>
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
                            {nicError && <p className="error-message">{nicError}</p>}
                            <input
                                name="nic"
                                value={formData.nic}
                                onChange={changeHandler}
                                type="text"
                                placeholder="NIC Number"
                                required
                                onBlur={validateNIC} // Validate on blur
                            />
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
                    <div className="loginsignup-agree">
                        <input type="checkbox" required />
                        <p>By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.</p>
                    </div>
                    <button type="submit">Continue</button>
                    {state === "Sign Up" ? (
                        <p className='loginsignup-login'>
                            Already have an account <span onClick={() => { setState("Login") }}>Login here</span>
                        </p>
                    ) : (
                        <>
                            <div className='forgot-password'>
                                <Link to={'/forgot-password'}>Forgot Password</Link>
                            </div>
                            <p className='loginsignup-login'>
                                Create an account <span onClick={() => { setState("Sign Up") }}>Register here</span>
                            </p>
                        </>
                    )}

                </form>
            </div>
        </div>
    );
};

export default LoginSignup;
