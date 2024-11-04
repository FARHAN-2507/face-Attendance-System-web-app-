import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Signup.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      if (res.data.success) {
        alert('Login successful');
        navigate('/home'); // Redirect to home page using navigate
        // Redirect or perform any action after successful login
      } else {
        alert('Login failed');
      }
    } catch (err) {
      alert('Error during login: ' + (err.response?.data?.error || 'Unexpected error'));
    }
  };

  return (
    <div className="signup-page">
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="Email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="password"
          name="Password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="form-input"
        />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="register-link">
        Not registered? <Link to="/Signup">Sign up here</Link>
      </p>
    </div>
    </div>
  );
};

export default Login;
