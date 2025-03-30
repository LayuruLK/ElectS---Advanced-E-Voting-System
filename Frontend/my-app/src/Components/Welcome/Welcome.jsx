import React from 'react';
import './Welcome.css';
import rotatingimg from '../Assests/rotating-img.png';
import face from '../Assests/face.png';
import platform from '../Assests/platform.png';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';

const Welcome = () => {
  const { theme } = useTheme();
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate("/contact"); 
  };

  return (
    <div className={`welcome-container ${theme}`}>
      <section className={`Home ${theme}`}>
        <div className={`text-box ${theme}`}>
          <h1>ElectS</h1>
          <h1>For Innovative Digitalized World!</h1>
          <p>
            Experience a secure, transparent, and efficient way to vote with our cutting-edge online election platform.
            Powered by the MERN stack and facial recognition authentication, ElectS ensures a seamless and trustworthy voting experience.
            Vote anytime, anywhere with confidence!
          </p>
          <span className="btn-box">
            <Link to='/dashboard' className="btn">Start Now</Link>
            <button type="button" className="btn" onClick={handleClick}>Contact Us</button>
          </span>
        </div>
        <img src={rotatingimg} className="rotating-img" alt="Rotating Graphic"/>
        <img src={face} className="face" alt="Face Recognition Icon"/>
        <img src={platform} alt="Platform Graphic"/>
      </section>
    </div>
  );
};

export default Welcome;
