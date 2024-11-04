import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Welcome from './components/Welcome';
import Student from './components/student';
import TakeAttendance from './components/TakeAttendance';
import ViewAttendance from './components/ViewAttendance';
import GenerateReport from './components/GenerateReport';
import Facultymanagement from './components/FacultyManagement';
import About from './components/About';




function App() {
  return (
    <Router>
      <div className="App">
        
      
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/Signup" element={<Signup />} /> 
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/students" element={<Student />} />
          <Route path="/Takeattendance" element={<TakeAttendance />} />
          <Route path="/Viewattendance" element={<ViewAttendance />} />
          <Route path="/GenerateReport" element={<GenerateReport />} />
          <Route path="/Facultymanagement" element={<Facultymanagement />} />
          <Route path="/About" element={<About />} />

          
          
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
