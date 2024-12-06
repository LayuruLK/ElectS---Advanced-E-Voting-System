import Navbar from '../Navbar/Navbar'
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {

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
          alert("Success")
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert("Npt Success")
        },
      );
  };

  return (
    <div>
      <Navbar />
      <h1> Contact</h1>
      <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" /><br></br><br></br>
      <label>Email</label>
      <input type="email" name="user_email" /><br></br><br></br>
      <label>Message</label>
      <textarea name="message" /><br></br><br></br>
      <input type="submit" value="Send" />
    </form>
    </div>
  )
}