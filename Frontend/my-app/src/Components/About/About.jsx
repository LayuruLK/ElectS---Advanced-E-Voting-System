import React from 'react';
import './About.css';
import { useTheme } from '../../Context/ThemeContext';

const About = () => {
  const { theme } = useTheme();
  return (
    <div className={`about-container ${theme}`}>
      <h1 className={`about-title ${theme}`}>About ElectS</h1>
      <p className={`about-description ${theme}`}>
        ElectS is a next-generation voting platform designed to empower citizens by making elections more transparent, accessible, and efficient. Our platform leverages cutting-edge technology to ensure the integrity of the electoral process, allowing users to engage with candidates, cast their votes securely, and stay informed about election results in real-time. Whether you're a voter or a candidate, ElectS provides a seamless and user-friendly experience that enhances civic participation. With a commitment to transparency and security, ElectS is reshaping the future of elections, making democracy more inclusive for everyone.
      </p>

      <h2 className={`features-title ${theme}`}>Key Features</h2>
      <ul className={`features-list ${theme}`} type='none'>
        <li className={`feature-item ${theme}`}>
          <h3>User Registration</h3>
          <p>
            ElectS offers a secure and straightforward user registration process, which includes email verification to ensure that only eligible voters can participate. The registration process is designed to be user-friendly, guiding users through each step with clear instructions. By implementing robust verification mechanisms, we ensure that the platform maintains the integrity of the electoral process, allowing only legitimate users to access and utilize the system.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Candidate Application</h3>
          <p>
            Aspiring candidates can apply and register their candidacy through the platform with ease. The process includes identity verification and qualification checks to ensure that only eligible candidates can participate. Candidates can submit their application, upload necessary documents, and track the status of their application in real-time. This streamlined process reduces the administrative burden and makes it easier for candidates to focus on their campaigns.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Real-time Election Updates</h3>
          <p>
            ElectS keeps voters informed with real-time updates on all aspects of the election process. This includes notifications about voting start and end times, candidate announcements, and live election results. By providing real-time information, ElectS ensures that voters are always in the loop, making it easier for them to participate and stay engaged in the democratic process.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Complaint Submission</h3>
          <p>
            ElectS offers a transparent and user-friendly complaint submission system that allows voters to raise concerns about candidates or the election process. Users can submit complaints through a simple form, which is then reviewed by the relevant authorities. This feature ensures that the election process is accountable and that any issues or irregularities are addressed promptly, maintaining the integrity of the election.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Secure Voting System</h3>
          <p>
            Our secure voting system uses state-of-the-art encryption technologies to ensure that each vote is cast and counted accurately. By leveraging blockchain technology, ElectS provides a tamper-proof voting system where every vote is securely recorded and cannot be altered. This guarantees the integrity of the election and instills confidence in voters that their votes truly matter.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Comprehensive Candidate Profiles</h3>
          <p>
            Voters can access detailed profiles of each candidate on ElectS, which include their policies, past records, and public opinions. This information is presented in a clear and organized manner, allowing voters to make informed decisions based on comprehensive data. By providing in-depth candidate profiles, ElectS empowers voters to choose the candidate who best represents their values and interests.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Election Analytics</h3>
          <p>
            ElectS offers comprehensive election analytics, providing users with detailed insights into voter turnout, demographic participation, and election results. These analytics are presented through intuitive charts and graphs, making it easy for users to understand the data. Whether you're a voter, candidate, or analyst, these insights can help you better understand the dynamics of the election.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Multi-device Support</h3>
          <p>
            ElectS is designed to be accessible across all devices, including smartphones, tablets, and desktops. The platform is optimized for different screen sizes, ensuring a seamless experience regardless of the device you're using. This multi-device support allows voters to participate in the election from anywhere, at any time, making the process more convenient and inclusive.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>Data Privacy</h3>
          <p>
            ElectS prioritizes the privacy of its users by implementing strict data protection measures. We adhere to global data privacy regulations and ensure that all user data is encrypted and securely stored. By maintaining a high standard of data privacy, ElectS protects users' personal information and builds trust with the electorate, ensuring that their participation in the election is safe and secure.
          </p>
        </li>
        <li className={`feature-item ${theme}`}>
          <h3>24/7 Customer Support</h3>
          <p>
            ElectS provides 24/7 customer support to assist users with any issues or questions they may have. Our dedicated support team is available around the clock to ensure that users have a smooth and stress-free experience on the platform. Whether you're having trouble with registration, voting, or any other feature, our support team is here to help, providing prompt and effective solutions to any problem you may encounter.
          </p>
        </li>
      </ul>

      <h2 className={`faq-title ${theme}`}>Frequently Asked Questions</h2>
      <ul className={`faq-list ${theme}`} type='none'>
        <li className={`faq-item ${theme}`}>
          <h3>How do I register to vote?</h3>
          <p>
            Registering to vote on ElectS is a straightforward process. Start by clicking the "Register" button on the homepage. You will be guided through a series of steps to enter your personal information, such as your name, email address, and identification details. Once you complete the form, an email will be sent to you for verification. Click on the verification link to complete your registration. If you encounter any issues during registration, our 24/7 support team is available to assist you.
          </p>
        </li>
        <li className={`faq-item ${theme}`}>
          <h3>Is my vote secure?</h3>
          <p>
            Yes, your vote is completely secure on ElectS. We employ advanced encryption and blockchain technology to ensure that each vote is securely cast and cannot be tampered with. Every vote is encrypted from the moment it is cast, ensuring that it remains confidential and is accurately counted. Our commitment to security means that voters can have full confidence that their vote is protected and that the election results are legitimate.
          </p>
        </li>
        <li className={`faq-item ${theme}`}>
          <h3>Can I change my vote after submission?</h3>
          <p>
            Once your vote has been submitted on ElectS, it cannot be changed. This policy is in place to maintain the integrity of the election process. We encourage all voters to carefully review their selections before finalizing their vote. Once the vote is submitted, it is securely recorded and cannot be altered. This ensures that all votes are final and that the election results are accurate and trustworthy.
          </p>
        </li>
        <li className={`faq-item ${theme}`}>
          <h3>How can I file a complaint?</h3>
          <p>
            If you need to file a complaint, ElectS provides a dedicated complaint submission system. You can access this feature from your dashboard by clicking on the "Complaint" section. Fill out the form with the details of your concern, including any relevant evidence or documentation. Once submitted, your complaint will be reviewed by our team, who will take the necessary actions to address the issue. You will receive updates on the status of your complaint through the platform.
          </p>
        </li>
        <li className={`faq-item ${theme}`}>
          <h3>What should I do if I encounter a problem?</h3>
          <p>
            If you encounter any issues while using ElectS, you can contact our 24/7 customer support team for assistance. Simply click on the "Support" button on the platform to connect with one of our representatives. Whether you're facing technical difficulties, have questions about the voting process, or need help with registration, our support team is here to help. We are committed to providing prompt and effective solutions to ensure that your experience on ElectS is smooth and hassle-free.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default About;