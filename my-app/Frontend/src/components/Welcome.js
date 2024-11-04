import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="Welcome">
      <h1>Welcome to the Face Recognition System</h1>
      <p>Manage attendance with ease using our face recognition technology.</p>
      <div>
        <Link to="/login" className="btn btn-primary mx-2">Login</Link>
        <Link to="/signup" className="btn btn-secondary mx-2">Sign Up</Link>
      </div>
    </div>
  );
};

export default Welcome;
