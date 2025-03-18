import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SetPassword.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const validatePassword = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/passwords/reset`, {
        token,
        password,
      });
      toast.success(response.data.message, { position: "top-center" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-password-title">Reset Your Password</h1>
      {passwordError && <div className="reset-password-error">{passwordError}</div>}
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <label className="reset-password-label">
          New Password:
          <input
            type="password"
            className="reset-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
          />
        </label>
        <label className="reset-password-label">
          Confirm Password:
          <input
            type="password"
            className="reset-password-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="reset-password-button" disabled={!!passwordError}>
          Set Password
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SetPassword;
