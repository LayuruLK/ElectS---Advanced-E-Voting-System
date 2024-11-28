import React from 'react';
import './Welcome.css';
import rotatingimg from '../Assests/rotating-img.png';
import face from '../Assests/face.png';
import platform from '../Assests/platform.png';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div>
        <section className="Home">
            <div className="text-box">
                <h1>ElectS</h1>
                <h1>For Innovetive Digitalized World!</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis cumque facilis repellendus dignissimos rerum, incidunt provident officiis libero assumenda accusamus!</p>
                <span class="btn-box">
                    <Link to='/dashboard' className="btn">Start Now</Link>
                    <button type="button" className="btn">Contact Us</button>
                </span>
            </div>
            <img src={rotatingimg} className="rotating-img" alt=""/>
            <img src={face} class="face" alt=""/>
            <img src={platform} alt=""/>
        </section>
    </div>
  )
}

export default Welcome
