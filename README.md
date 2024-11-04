Face Recognition Attendance System
This project is a Face Recognition Attendance System developed using React for the front end, Flask for the back end, and MySQL for the database. 
The system allows student attendance to be recorded automatically by recognizing faces, providing an efficient and secure solution for educational institutions or other organizations.
Face images are stored in AWS and linked with MySQL.


Features
Face Detection & Recognition: Utilizes face recognition to log attendance accurately.
Student and Faculty Management: Register students and faculty, and link them to course information.
Attendance Tracking: Mark attendance automatically when a face is recognized.
Report Generation: Generate attendance reports for students.
Role Management: Define and manage roles for faculty and admin users.
User Authentication: User login and signup with secure authentication.
Image Storage: Stores captured student images on Amazon AWS for reliable access.


Tech Stack
Frontend: React, Bootstrap, CSS
Backend: Flask
Database: MySQL (using XAMPP Server for local development)
Image Storage: Amazon AWS (for storing student face images)
Other Libraries: OpenCV (for face detection and recognition)


Usage
User Registration: Admins can register students and faculty.
Taking Attendance: Open the attendance page and allow the system to recognize faces. Attendance is marked when a recognized face is detected.
Viewing Attendance Reports: Admins and faculty can generate and view attendance reports


Future Improvements
Enhanced Facial Recognition Accuracy: Improve model accuracy.
Role-based Access Control: More granular permissions for different user roles.
Offline Mode: Allow attendance recording even when offline.
Advanced Reporting: Detailed analysis and insights into attendance data.
Contributing
Contributions are welcome! Please create an issue or pull request if you'd like to improve the project.

License
This project is licensed under the MIT License.
