import React from 'react';
import './Feature.css';
import feature1 from '../Assests/shield.png';
import feature2 from '../Assests/vote.png';
import feature3 from '../Assests/ux-design.png';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';

const Feature = () => {
  const { theme } = useTheme();
  return (
    <section className={`features-section ${theme}`}>
      <h2 className={`features-heading ${theme}`}>Our Exclusive Features</h2>
      <p className="features-subheading">Explore the tools and technologies that make us stand out!</p>

      <div className="features-container">
        <div className="feature-card">
          <img src={feature1} alt="Feature 1" className="feature-icon" />
          <h3>Secure Voting</h3>
          <p>Our platform ensures top-notch security with AI-based facial recognition and encrypted data handling for a seamless voting experience.</p>
        </div>

        <div className="feature-card">
          <img src={feature2} alt="Feature 2" className="feature-icon" />
          <h3>Real-Time Results</h3>
          <p>Get accurate and real-time updates on election results with interactive graphs and analytics.</p>
        </div>

        <div className="feature-card">
          <img src={feature3} alt="Feature 3" className="feature-icon" />
          <h3>User-Friendly Design</h3>
          <p>Experience a highly intuitive and responsive design that works flawlessly across all devices.</p>
        </div>
      </div>

      <div className="cta-section">
        <Link to='/about'><button className="cta-button">Learn More</button></Link>
        <Link to='/login'> <button className="cta-button cta-button-alt">Get Started</button></Link>
      </div>
    </section>
  );
};

export default Feature;
