import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button 
} from '@mui/material';
import axios from 'axios';
import Navbar from './Navbar';

const FacultyManagement = () => {
  const [facultyRecords, setFacultyRecords] = useState([]);

  useEffect(() => {
    fetchFacultyRecords();
  }, []);

  // Fetch all faculty records
  const fetchFacultyRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faculty-records');
      setFacultyRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch faculty records:', error);
    }
  };

  // Remove a faculty record
  const removeFaculty = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        await axios.delete(`http://localhost:5000/api/remove-faculty/${employeeId}`);
        setFacultyRecords(facultyRecords.filter(record => record.Employee_ID !== employeeId));
      } catch (error) {
        console.error('Failed to remove faculty:', error);
      }
    }
  };

  return (
    <><Navbar /><div>
      <Typography variant="h4" gutterBottom>
        Faculty Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facultyRecords.map((faculty) => (
              <TableRow key={faculty.Employee_ID}>
                <TableCell>{faculty.Employee_ID}</TableCell>
                <TableCell>{faculty.First_Name}</TableCell>
                <TableCell>{faculty.Last_Name}</TableCell>
                <TableCell>{faculty.Contact}</TableCell>
                <TableCell>{faculty.Email}</TableCell>
                <TableCell>{faculty.Subject}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => removeFaculty(faculty.Employee_ID)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div></>
  );
};

export default FacultyManagement;
