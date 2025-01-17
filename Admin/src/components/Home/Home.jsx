import React from 'react'; // Assuming the sidebar component is in the same directory
import './Home.css'; // Import the CSS file
import HomeSideBar from '../HomeSideBar/HomeSideBar';
import Projects from '../Projects/Projects';

const Home = () => {
  return (
    <div className="home-container">
      <div className="mainn-content">
        <h3>This is the Home Page</h3>
      </div>
    </div>
  );
};

export default Home;
