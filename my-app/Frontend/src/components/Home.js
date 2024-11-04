import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from './Navbar';  // Import the new Navbar component
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('student_update', (data) => {
      console.log(data.message); // Update the UI or fetch new data
      fetchStudents(); // Implement this function to fetch students
    });

    return () => {
      socket.disconnect();  // Cleanup the socket when component unmounts
    };
  }, []);

  const fetchStudents = async () => {
    const response = await fetch('http://localhost:5000/api/students'); // Your endpoint
    const students = await response.json();
    console.log(students); // Update state/UI with fetched students
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}

      {/* Home Container */}
      <div className="home-container">
        <h1>Welcome to the Face Recognition Attendance System</h1>
        <p>This system allows you to manage attendance using face recognition technology.</p>
        <p>Please select an option from the menu below.</p>

        {/* Functionality buttons */}
        <div className="button-container">
          <button className="btn btn-primary" onClick={() => navigate('/TakeAttendance')}>Take Attendance</button>
          <button className="btn btn-secondary" onClick={() => navigate('/ViewAttendance')}>View Attendance</button>
          <button className="btn btn-success" onClick={() => navigate('/GenerateReport')}>Generate Report</button>
          <button className="btn btn-warning" onClick={() => navigate('/students')}>Add Student</button>
          <button className="btn btn-info" onClick={() => navigate('/FacultyManagement')}>Manage Faculty</button>
          <button className="btn btn-danger" onClick={() => navigate('/About')}>About</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
