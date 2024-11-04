import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link here
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Contact: '',
    Email: '',
    Password: '',
    Subject: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
   
    try {
      const response = await axios.post('http://localhost:5000/api/faculty/register', formData);
      setMessage(response.data.message || 'Faculty registered successfully');
      setFormData({
        First_Name: '',
        Last_Name: '',
        Contact: '',
        Email: '',
        Password: '',
        Subject: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="signup-page">
        <div className="container mt-5">
        <h2>Registration</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="First_Name"
        value={formData.First_Name}
        onChange={handleChange}
        placeholder="First Name"
        required
        className="form-input"
      />
      <input
        type="text"
        name="Last_Name"
        value={formData.Last_Name}
        onChange={handleChange}
        placeholder="Last Name"
        required
        className="form-input"
      />
      <input
        type="text"
        name="Contact"
        value={formData.Contact}
        onChange={handleChange}
        placeholder="Contact"
        required
        className="form-input"
      />
      <input
        type="email"
        name="Email"
        value={formData.Email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="form-input"
      />
      <input
        type="password"
        name="Password"
        value={formData.Password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="form-input"
      />
      <input
        type="text"
        name="Subject"
        value={formData.Subject}
        onChange={handleChange}
        placeholder="Subject"
        required
        className="form-input"
      />
      <button type="submit"  className="btn btn-primary">Register</button>

      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
    <p className="register-link">
        Not registered? <Link to="/Login">Login Here</Link> </p>
    </div>
    </div>
  );
};

export default Signup;
