import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Find Us Section */}
        <div className="footer-section">
          <h3>Find us</h3>
          <p>ElectS is a cutting-edge online voting platform built using the MERN (MongoDB, Express.js, React, Node.js) stack. It leverages Facial recognition technology to provide a secure and transparent voting experience. ElectS is designed to modernize elections by ensuring accessibility, security, and cost efficiency for both local and overseas voters.

</p>
          <p>University Of Vavuniya Sri Lanka</p>
          <p>📞 +91-9999887938</p>
          <p>📧 info@example.com</p>
        </div>

        {/* Quick Links Section 1 */}
        <div className="footer-section">
          <h3>Quick links</h3>
          <ul>
            <li>Candidate Profiles</li>
            <li>Real-Time Voting</li>
            <li>How to Get Started</li>
            <li>Technology Stack</li>
            <li>Secure System Overview</li>
          </ul>
        </div>

        {/* Quick Links Section 2
        <div className="footer-section">
          <h3>Quick links</h3>
          <ul>
            <li>Remove Background</li>
            <li>Shadows & Mirror Reflection</li>
            <li>Logo Design</li>
            <li>Vectorization</li>
            <li>Hair Masking/Clipping</li>
            <li>Image Cropping</li>
          </ul>
        </div> */}

        <div className="footer-section">
          <h3>Follow us</h3>
          <ul className="social-links">
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} /> Twitter
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} /> Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Copyright © 2024 | Designed with ❤️ by the ElectS Team.</p>
        <ul className="footer-nav">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Pricing</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
      </div>  
    </footer>
  );
};

export default Footer;
