import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import Navbar from './Navbar';

const TakeAttendance = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const markAttendance = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setError('Webcam not available or image not captured.');
        setMessage('');
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:5000/api/mark-attendance', {
          faceImage: imageSrc
        });

        setMessage(response.data.message || 'Attendance marked successfully!');
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to mark attendance');
        setMessage('');
      }
    } else {
      setError('Webcam not available.');
    }
  };

  return (
    <div>
      <Navbar />  {/* Navbar Component */}
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mark Attendance
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ my: 2 }}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            height={300}
          />
        </Box>

        <Button variant="contained" onClick={markAttendance} fullWidth>
          Mark Attendance
        </Button>
      </Box>
    </div>
  );
};

export default TakeAttendance;
