import React from 'react';
import './Welcome.css';
import rotatingimg from '../Assests/rotating-img.png';
import face from '../Assests/face.png';
import platform from '../Assests/platform.png';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';

const Welcome = () => {
  const { theme } = useTheme();
  return (
    <div className={`welcome-container ${theme}`}>
        <section className={`Home ${theme}`}>
            <div className={`text-box ${theme}`}>
                <h1>ElectS</h1>
                <h1>For Innovative Digitalized World!</h1>
                <p>Experience a secure, transparent, and efficient way to vote with our cutting-edge online election platform. Powered by the MERN stack and facial recognition authentication, ElectS ensures a seamless and trustworthy voting experience. Vote anytime, anywhere with confidence!</p>
                <span className="btn-box">
                    <Link to='/dashboard' className="btn">Start Now</Link>
                    <button type="button" className="btn">Contact Us</button>
                </span>
            </div>
            <img src={rotatingimg} className="rotating-img" alt=""/>
            <img src={face} className="face" alt=""/>
            <img src={platform} alt=""/>
        </section>
    </div>
  )
}

export default Welcome
