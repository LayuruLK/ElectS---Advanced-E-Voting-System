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
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          <p>987/825 sec 9 rohini 35</p>
          <p>📞 +91-9999887938</p>
          <p>📧 info@example.com</p>
        </div>

        {/* Quick Links Section 1 */}
        <div className="footer-section">
          <h3>Quick links</h3>
          <ul>
            <li>Image Retouching</li>
            <li>Clipping Path</li>
            <li>Hollow Man Montage</li>
            <li>Ebay & Amazon</li>
            <li>Hair Masking/Clipping</li>
            <li>Image Cropping</li>
          </ul>
        </div>

        {/* Quick Links Section 2 */}
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
        </div>

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
        <p>Copyright ©2017 | Designed With ❤️ by Your Company Name</p>
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
