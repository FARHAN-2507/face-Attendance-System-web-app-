import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import Navbar from './Navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            About the Face Recognition Attendance System
          </Typography>
          <Typography variant="body1" paragraph>
            The Face Recognition Attendance System is a modern solution designed to streamline the attendance marking process in educational institutions. By leveraging advanced facial recognition technology, this system provides a quick and efficient way to record student attendance without the need for manual input.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Automatic Attendance Marking: Use facial recognition to mark attendance seamlessly.</Typography>
            </li>
            <li>
              <Typography variant="body1">Faculty Management: Manage faculty records with ease, including viewing and removing faculty members.</Typography>
            </li>
            <li>
              <Typography variant="body1">Attendance Records: View, export, and manage attendance records for all students.</Typography>
            </li>
            <li>
              <Typography variant="body1">Student Management: Efficiently manage student records and attendance.</Typography>
            </li>
          </ul>
          <Typography variant="h6" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="body1" paragraph>
            The project is developed by a dedicated team of software engineers and designers committed to enhancing the educational experience through technology. Our goal is to provide a user-friendly interface and reliable functionality to support teachers and students alike.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions or feedback, feel free to reach out to us at: <a href="mailto:farhanakthar99@gmail.com">farhanakthar99@gmail.com</a>.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default About;
