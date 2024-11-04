// src/components/StudentRegistration.js
import React, { useState, useRef } from 'react';
import axios from 'axios';

const StudentRegistration = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      setError('Error accessing camera: ' + error.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const imageBase64 = canvas.toDataURL('image/jpeg');
    setImagePreview(imageBase64);
    return imageBase64;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const imageBase64 = imagePreview;
    if (!imageBase64) {
      setError('Please capture a face image first');
      setLoading(false);
      return;
    }

    const formData = {
      EnlNo: event.target.EnlNo.value,
      Name: event.target.Name.value,
      Department: event.target.Department.value,
      Course: event.target.Course.value,
      Year: event.target.Year.value,
      Semester: event.target.Semester.value,
      Section: event.target.Section.value,
      Gender: event.target.Gender.value,
      DOB: event.target.DOB.value,
      Email: event.target.Email.value,
      Phone: event.target.Phone.value,
      Address: event.target.Address.value,
      faceImage: imageBase64
    };

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(response.data.message);
      event.target.reset();
      setImagePreview(null);
      stopCamera();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Student Registration</h2>
      
      {/* Status Messages */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          Processing registration...
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      {/* Camera Section */}
      <div className="mb-6">
        <div className="mb-4">
          <video 
            ref={videoRef} 
            autoPlay 
            style={{ width: '400px', height: '300px', backgroundColor: '#000' }}
            className="rounded"
          />
        </div>
        
        {imagePreview && (
          <div className="mb-4">
            <img 
              src={imagePreview} 
              alt="Captured face" 
              style={{ width: '200px' }} 
              className="rounded"
            />
          </div>
        )}

        <div className="space-x-4 mb-6">
          <button 
            onClick={startCamera}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Camera
          </button>
          
          <button 
            onClick={captureImage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Capture Image
          </button>
          
          <button 
            onClick={stopCamera}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Camera
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input 
            name="EnlNo" 
            placeholder="Enrollment Number" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Name" 
            placeholder="Full Name" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Department" 
            placeholder="Department" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Course" 
            placeholder="Course" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Year" 
            placeholder="Year" 
            type="number" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Semester" 
            placeholder="Semester" 
            type="number" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Section" 
            placeholder="Section" 
            className="p-2 border rounded" 
            required 
          />
          <select 
            name="Gender" 
            className="p-2 border rounded" 
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input 
            name="DOB" 
            type="date" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Email" 
            type="email" 
            placeholder="Email" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Phone" 
            placeholder="Phone Number" 
            className="p-2 border rounded" 
            required 
          />
          <input 
            name="Address" 
            placeholder="Address" 
            className="p-2 border rounded" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register Student
        </button>
      </form>
    </div>
  );
};

export default StudentRegistration;