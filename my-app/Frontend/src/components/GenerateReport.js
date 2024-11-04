import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button, 
  TextField 
} from '@mui/material';
import axios from 'axios';
import Navbar from './Navbar';

const GenerateStudentReport = () => {
  const [records, setRecords] = useState([]);
  const [Enrollment_No, setEnrollment_No] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');

  const fetchStudentRecords = async () => {
    if (!Enrollment_No) {
      setError('Please enter the Enrollment Number');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/student-report/${Enrollment_No}`);
      setRecords(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch student records:', err);
      setError('Student records not found');
    }
  };

  const exportToCsv = async () => {
    if (!Enrollment_No) {
      setError('Please enter the Enrollment Number to export CSV');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/export-student-csv/${Enrollment_No}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setError('');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      setError('Failed to export CSV');
    }
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Generate Student Attendance Report
      </Typography>

      <TextField
        label="Enter Student Enrollment Number"
        variant="outlined"
        value={Enrollment_No}
        onChange={(e) => setEnrollment_No(e.target.value)}
        fullWidth
        margin="normal"
      />
      
      {error && <Typography color="error">{error}</Typography>}
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={fetchStudentRecords} 
        style={{ marginBottom: '20px' }}
      >
        Fetch Records
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>EnlNo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Check-in Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.attendance_id}>
                <TableCell>{record.Enrollment_No}</TableCell>
                <TableCell>{record.Name}</TableCell>
                <TableCell>{record.Email}</TableCell>
                <TableCell>{record.Course}</TableCell>
                <TableCell>{record.Section}</TableCell>
                <TableCell>{new Date(record.check_in).toLocaleString()}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {records.length > 0 && (
  <Button 
    variant="contained" 
    color="secondary" 
    onClick={exportToCsv} 
    style={{ marginTop: '20px', marginRight: '10px', padding: '10px 20px' }}
  >
    Export to CSV
  </Button>
)}

{downloadUrl && (
  <a href={downloadUrl} download={`student_report_${Enrollment_No}.csv`} style={{ textDecoration: 'none' }}>
    <Button 
      variant="contained" 
      color="primary" 
      style={{ marginTop: '20px', padding: '10px 20px' }}
    >
      Download CSV
    </Button>
  </a>
)}

    </div>
  );
};

export default GenerateStudentReport;
