import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import './student.css';
import Navbar from './Navbar';  // Import the new Navbar component


const Student = () => {
  const initialFormState = {
    EnlNo: '',
    Name: '',
    Department: '',
    Course: '',
    Year: '',
    Semester: '',
    Section: '',
    Gender: '',
    DOB: '',
    Email: '',
    Phone: '',
    Address: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false); // Toggle for camera
  const webcamRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setMessage('');
    setError('');
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Ensure the webcam is open
      if (!cameraOpen) {
        throw new Error('Please open the webcam and ensure your face is visible');
      }
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Please enable the webcam and ensure your face is visible');
      }

      const response = await axios.post('http://localhost:5000/api/register', {
        ...formData,
        faceImage: imageSrc
      });

      setMessage('Registration successful!');
      alert('Registration successful!');  // Alert on success
      resetForm();
      setCameraOpen(false); // Close camera after successful registration
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><Navbar /><div className="Navbar">

      <h2 className="title">Student Registration</h2>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="EnlNo">Enrollment Number</label>
            <input
              type="text"
              id="EnlNo"
              name="EnlNo"
              value={formData.EnlNo}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Name">Full Name</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Department">Department</label>
            <input
              type="text"
              id="Department"
              name="Department"
              value={formData.Department}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Course">Course</label>
            <input
              type="text"
              id="Course"
              name="Course"
              value={formData.Course}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Year">Year</label>
            <select
              id="Year"
              name="Year"
              value={formData.Year}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Semester">Semester</label>
            <select
              id="Semester"
              name="Semester"
              value={formData.Semester}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Section">Section</label>
            <input
              type="text"
              id="Section"
              name="Section"
              value={formData.Section}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Gender">Gender</label>
            <select
              id="Gender"
              name="Gender"
              value={formData.Gender}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="DOB">Date of Birth</label>
            <input
              type="date"
              id="DOB"
              name="DOB"
              value={formData.DOB}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="Phone">Phone</label>
            <input
              type="tel"
              id="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={handleInputChange}
              required
              className="form-input" />
          </div>

          <div className="form-group full-width">
            <label htmlFor="Address">Address</label>
            <textarea
              id="Address"
              name="Address"
              value={formData.Address}
              onChange={handleInputChange}
              required
              className="form-input"
              rows="2" />
          </div>
        </div>

        <div className="webcam-container">
          {cameraOpen && (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
              height={300}
              mirrored={true}
              className="webcam" />
          )}
        </div>

        {/* Form buttons */}
        <div className="button-group">
          <button
            type="button"
            onClick={() => setCameraOpen(!cameraOpen)}
            className="button toggle-camera-button"
          >
            {cameraOpen ? 'Close Camera' : 'Open Camera'}
          </button>
          <button
            type="submit"
            disabled={isLoading || !cameraOpen}
            className="button submit-button"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className="button reset-button"
          >
            Reset
          </button>
        </div>
      </form>
    </div></>
  );
};

export default Student;