import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AttendanceRecords = () => {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  // Inline style for a wider container
  const containerStyle = {
    maxWidth: '90%', // Adjust width as needed
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const fetchRecords = async (filter) => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance-records', {
        params: { date_filter: filter }
      });
      setRecords(res.data);
      setError('');
    } catch (err) {
      setRecords([]);
      setError(err.response?.data?.error || 'Server error');
    }
  };

  useEffect(() => {
    fetchRecords(dateFilter);
  }, [dateFilter]);

  return (
    <>
      <Navbar />
      <div className="container" style={containerStyle}>
        <h2 className="text-center">Attendance Records</h2>

        <div className="date-filter mt-3">
          <label htmlFor="date" className="form-label">Select Date:</label>
          <input
            type="date"
            className="form-control"
            id="date"
            onChange={(e) => setDateFilter(e.target.value)}
            value={dateFilter}
          />
        </div>

        {error ? (
          <p className="text-danger mt-3">{error}</p>
        ) : (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Attendance ID</th>
                <th>Enrollment No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Section</th>
                <th>Check-In Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.attendance_id}>
                  <td>{record.attendance_id}</td>
                  <td>{record.Enrollment_No}</td>
                  <td>{record.Name}</td>
                  <td>{record.Email}</td>
                  <td>{record.Course}</td>
                  <td>{record.Section}</td>
                  <td>{record.check_in}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AttendanceRecords;
