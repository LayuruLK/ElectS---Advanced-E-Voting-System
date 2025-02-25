import React, { useState } from 'react';
import './HomeSideBar.css';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle,FaUsersCog, FaProjectDiagram, FaClipboardList, FaUsers, FaFileAlt, FaListUl, FaList, FaEdit, FaPlus } from 'react-icons/fa';
import { HiIdentification } from "react-icons/hi";

const HomeSideBar = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(prevSection => (prevSection === section ? null : section));
  };

  return (
    <div className='home-s-br-container'>
      <Link to={'/'} style={{ textDecoration: 'none' }}>
        <div className="home-s-br-card">
          <FaHome className='home-s-br-icon' />
          <p>Home</p>
        </div>
      </Link>

      <Link to={'/projects'} style={{ textDecoration: 'none' }}>
        <div className="home-s-br-card">
          <FaProjectDiagram className='home-s-br-icon' />
          <p>Projects</p>
        </div>
      </Link>

      <Link to={'/complaints'} style={{ textDecoration: 'none' }}>
        <div className="home-s-br-card">
          <FaClipboardList className='home-s-br-icon' />
          <p>Complaints</p>
        </div>
      </Link>

      <div 
        className={`home-s-br-card ${activeSection === 'election' ? 'active' : ''}`} 
        onClick={() => handleSectionClick('election')}
      >
        <FaListUl className='home-s-br-icon' />
        <p>Election</p>
        {activeSection === 'election' && (
          <div className='home-s-br-sublinks'>
            <Link to={'/election-list'}><FaList className='home-s-br-sublink-icon' /> Election List</Link>
            <Link to={'/update-election'}><FaEdit className='home-s-br-sublink-icon' /> Update Election</Link>
            <Link to={'/add-election'}><FaPlus className='home-s-br-sublink-icon' /> Add Election</Link>
          </div>
        )}
      </div>

      <div 
        className={`home-s-br-card ${activeSection === 'review' ? 'active' : ''}`} 
        onClick={() => handleSectionClick('review')}
      >
        <FaFileAlt className='home-s-br-icon' />
        <p>Review</p>
        {activeSection === 'review' && (
          <div className='home-s-br-sublinks'>
            <Link to={'/nic-review'}><HiIdentification className='home-s-br-sublink-icon' /> NIC Review</Link>
            <Link to={'/project-review'}><FaProjectDiagram className='home-s-br-sublink-icon' /> Project Review</Link>
            <Link to={'/complaint-review'}><FaExclamationTriangle className='home-s-br-sublink-icon' /> Complaint Review</Link>
            <Link to={'/candidate-review'}><FaUsersCog className='home-s-br-sublink-icon' /> Candidate Review</Link>
            <Link to={'/report-review'}><FaFileAlt className='home-s-br-sublink-icon' /> Report Review</Link>
          </div>
        )}
      </div>

      <div 
        className={`home-s-br-card ${activeSection === 'party' ? 'active' : ''}`} 
        onClick={() => handleSectionClick('party')}
      >
        <FaUsers className='home-s-br-icon' />
        <p>Party</p>
        {activeSection === 'party' && (
          <div className='home-s-br-sublinks'>
            <Link to={'/party-list'}><FaList className='home-s-br-sublink-icon' /> Party List</Link>
            <Link to={'/update-party'}><FaEdit className='home-s-br-sublink-icon' /> Update Party</Link>
            <Link to={'/add-party'}><FaPlus className='home-s-br-sublink-icon' /> Add Party</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSideBar;
