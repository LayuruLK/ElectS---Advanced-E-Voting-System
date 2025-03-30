import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaCrown, FaGavel, FaMapMarkedAlt, FaArrowUp } from 'react-icons/fa';
import './Election.css';
import { useTheme } from '../../Context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Election = () => {
  const { theme } = useTheme();
  const [elections, setElections] = useState({
    general: [],
    presidential: [],
    parlimentary: [],
    provincial: [],
  });
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const userId = localStorage.getItem('user-id');
  const isCandidate = localStorage.getItem('user-isCandidate');

  const fetchElectionData = async (url, type) => {
    try {
      const response = await axios.get(url);
      setElections(prev => ({ ...prev, [type]: response.data.data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchElectionData(`${BASE_URL}/api/v1/elections`, 'general');
    fetchElectionData(`${BASE_URL}/api/v1/presidentialElections`, 'presidential');
    fetchElectionData(`${BASE_URL}/api/v1/parlimentaryElections`, 'parlimentary');
    fetchElectionData(`${BASE_URL}/api/v1/provincialElections`, 'provincial');

    // Scroll event to toggle the visibility of the Scroll to Top button
    const handleScroll = () => {
      if (window.scrollY > 300) { // Show button after scrolling down 300px
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (type) => {
    const section = document.getElementById(`${type}-section`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calculateCountdowns = (electionList, type) => {
    const newCountdowns = {};
    electionList.forEach(election => {
      const now = new Date();
      const startTime = new Date(election.startTime);
      const endTime = new Date(election.endTime);

      if (now < startTime) {
        const timeLeft = startTime - now;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        newCountdowns[election._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (now >= startTime && now <= endTime) {
        newCountdowns[election._id] = 'Election has started!';
      } else {
        newCountdowns[election._id] = 'Election has ended!';
      }
    });
    setCountdowns(prev => ({ ...prev, [type]: newCountdowns }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      calculateCountdowns(elections.general, 'general');
      calculateCountdowns(elections.presidential, 'presidential');
      calculateCountdowns(elections.parlimentary, 'parlimentary');
      calculateCountdowns(elections.provincial, 'provincial');
    }, 1000);

    return () => clearInterval(interval);
  }, [elections]);

  const checkIfUserIsCandidate = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/users/profile/${userId}`);
      return response.data.isCandidate;
    } catch (err) {
      Swal.fire('Error', 'Failed to check user status', 'error');
      return false;
    }
  };

  const handleApply = async (electionId, electionType, electionProvince = null) => {
    const isCandidate = await checkIfUserIsCandidate();

    if (!isCandidate) {
      return Swal.fire('Error', "You aren't a candidate", 'error');
    }

    // Determine the endpoint based on the election type
    let endpoint;
    switch (electionType) {
      case 'general':
        endpoint = `${BASE_URL}/api/v1/elections/${electionId}/apply`;
        break;
      case 'presidential':
        endpoint = `${BASE_URL}/api/v1/presidentialElections/${electionId}/apply`;
        break;
      case 'parlimentary':
        endpoint = `${BASE_URL}/api/v1/parlimentaryElections/${electionId}/apply`;
        break;
      case 'provincial':
        endpoint = `${BASE_URL}/api/v1/provincialElections/${electionId}/apply`;
        break;
      default:
        return Swal.fire('Error', 'Invalid election type', 'error');
    }

    // Check province for provincial elections
    if (electionType === 'provincial') {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/users/profile/${userId}`);
        let userProvince = response.data.province;

        // Remove "Province" from userProvince
        userProvince = userProvince.replace(" Province", "").trim();

        console.log(userProvince);
        console.log(electionProvince);


        if (userProvince !== electionProvince) {
          return Swal.fire('Error', `You can only apply for provincial elections in your province (${userProvince}).`, 'error');
        }
      } catch (err) {
        return Swal.fire('Error', 'Failed to verify user province', 'error');
      }
    }

    // Confirm application
    try {
      const result = await Swal.fire({
        title: 'Confirm Application',
        text: 'Are you sure you want to apply for this election?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await axios.post(endpoint, { userId });
        Swal.fire('Applied!', response.data.message, 'success');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        Swal.fire('Error', err.response.data.message, 'error');
      } else {
        Swal.fire('Error', err.response?.data?.message || 'An error occurred', 'error');
      }
    }
  };


  const getElectionLink = (type, id) => {
    switch (type) {
      case 'presidential':
        return `/presidential-election/${id}`;
      case 'parlimentary':
        return `/parlimentary-election/${id}`;
      case 'provincial':
        return `/provincial-election/${id}`;
      default:
        return `/election/${id}`;
    }
  };

  const renderElections = (electionList, type) => (
    <div id={`${type}-section`}>
      <h2 className="el-lst-title">{type.charAt(0).toUpperCase() + type.slice(1)} Elections</h2>
      {electionList.length > 0 ? (
        <div className={`el-lst-table ${theme}`}>
          {electionList.map(election => (
            <div key={election._id} className={`el-lst-item ${theme}`}>
              <Link to={getElectionLink(type, election._id)}>
                <table className={`el-lst-details ${theme}`}>
                  <tbody>
                    <tr>
                      <td style={{ width: '20%' }}><strong>Election Name:</strong></td>
                      <td style={{ width: '80%' }} className='el-lst-name'>
                        {type === 'presidential' ? `Presidential Election ${election.year}` :
                          type === 'parlimentary' ? `Parliamentary Election ${election.year}` :
                            type === 'provincial' ? `Provincial Election ${election.year}` :
                              election.name}
                      </td>
                    </tr>
                    {type === 'provincial' && (
                      <tr>
                        <td style={{ width: '20%' }}><strong>Province:</strong></td>
                        <td style={{ width: '80%' }}>{election.province}</td>
                      </tr>
                    )}
                    {type === 'general' && (
                      <tr>
                        <td style={{ width: '20%' }}><strong>Location:</strong></td>
                        <td style={{ width: '80%' }}>{election.where}</td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ width: '20%' }}><strong>Date:</strong></td>
                      <td style={{ width: '80%' }}>{new Date(election.date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td style={{ width: '20%' }}><strong>Start:</strong></td>
                      <td style={{ width: '80%' }}>{new Date(election.startTime).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ width: '20%' }}><strong>End:</strong></td>
                      <td style={{ width: '80%' }}>{new Date(election.endTime).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ width: '20%' }}><strong>Countdown:</strong></td>
                      <td style={{ width: '80%' }}>{countdowns[type]?.[election._id]}</td>
                    </tr>
                  </tbody>
                </table>
              </Link>
              {isCandidate=="true" &&
                <button
                  onClick={() => handleApply(election._id, type, election.province)}
                  className="el-lst-apply-btn"
                >
                  Apply
                </button>
              }
            </div>
          ))}
        </div>
      ) : (
        <p className="el-lst-empty">No {type} elections found.</p>
      )}
    </div>
  );


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`el-lst-container ${theme}`}>
      <h1 className={`el-lst-title ${theme}`}>Elections</h1>
      <div className={`el-lst-buttons ${theme}`}>
        <button onClick={() => scrollToSection('presidential')} className="el-btn">
          <FaCrown className="el-icon" /> Presidential Elections
        </button>
        <button onClick={() => scrollToSection('parlimentary')} className="el-btn">
          <FaGavel className="el-icon" /> Parliamentary Elections
        </button>
        <button onClick={() => scrollToSection('provincial')} className="el-btn">
          <FaMapMarkedAlt className="el-icon" /> Provincial Elections
        </button>
      </div>
      {renderElections(elections.general, 'general')}
      {renderElections(elections.presidential, 'presidential')}
      {renderElections(elections.parlimentary, 'parlimentary')}
      {renderElections(elections.provincial, 'provincial')}

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-to-top-btn">
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default Election;
