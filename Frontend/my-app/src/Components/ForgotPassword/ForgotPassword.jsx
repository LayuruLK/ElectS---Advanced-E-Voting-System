import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import "./ForgotPassword.css"; // Import the CSS file
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [nicNo, setNicNo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/passwords/forgotpassword`,
        { email, nicNo }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        confirmButtonColor: "#6a11cb",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#f44336",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="text"
          placeholder="NIC Number"
          className="forgot-password-input"
          value={nicNo}
          onChange={(e) => setNicNo(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="forgot-password-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="forgot-password-button" type="submit">
          Request Password Reset
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
