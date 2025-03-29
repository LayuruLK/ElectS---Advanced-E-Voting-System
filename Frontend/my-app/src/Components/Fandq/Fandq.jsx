// FandQ.jsx

import React from 'react';
import './Fandq.css';
import { useTheme } from '../../Context/ThemeContext';

const FandQ = () => {
  const { theme } = useTheme();
  return (
    <div className={`faq-container ${theme}`}>
      <section className={`faq-section ${theme}`}>
        <div className={`faq-header ${theme}`}>
          <h1>Welcome to ElectS</h1>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className={`faq-content ${theme}`}>
          <div className="faq-item">
            <h3 className="faq-question">What is ElectS?</h3>
            <p className="faq-answer">ElectS is an innovative platform designed to digitize and enhance the voting experience with advanced features like facial recognition, transparency, and accessibility.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">How does it ensure security?</h3>
            <p className="faq-answer">Our platform integrates Advanced facial recognition and encrypted data transmission to ensure voter identity and protect sensitive information.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Can I access it on my mobile?</h3>
            <p className="faq-answer">Yes, ElectS is fully responsive and can be accessed on multiple devices, including smartphones, tablets, and desktops.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Is it user-friendly?</h3>
            <p className="faq-answer">ElectS features an intuitive interface with step-by-step guidance to ensure a seamless experience for all users.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Who can use ElectS?</h3>
            <p className="faq-answer">ElectS is designed for governments, organizations, and voters who seek a modern, transparent, and efficient voting system.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FandQ;
