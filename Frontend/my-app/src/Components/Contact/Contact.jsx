
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';
import { useTheme } from '../../Context/ThemeContext';

export default function Contact() {
  const { theme } = useTheme();
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_5j6pjei',
         'template_nfhpmht',
          form.current, {
        publicKey: '9pmrFlEWJYdZLbXNe',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("Success");
        // Clear the form fields
        form.current.reset();
      },

        (error) => {
          console.log('FAILED...', error.text);
          alert("Not Success")
        },
      );
  };

  return (
    <div className={`contact-page ${theme}`}>
      
      <h1 className={`title-contat ${theme}`}> Contact Us</h1>
      <form ref={form} onSubmit={sendEmail} className={`contact-form ${theme}`}>
      <label className='contact-label'>Name</label>
      <input className='contact-input' type="text" name="user_name" placeholder='Enter your name'/><br></br><br></br>
      <label className='contact-label'>Email</label>
      <input className='contact-input' type="email" name="user_email" placeholder='Enter your email'/><br></br><br></br>
      <label className='contact-label' >Message</label>
      <textarea className='contact-textarea' name="message" placeholder='Leave your message here...'/><br></br><br></br>
      <input className='contact-submit' type="submit" value="Send" />
    </form>
    </div>
  )
}