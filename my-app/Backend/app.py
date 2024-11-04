import csv
from flask import Flask, make_response, request, jsonify
from flask_socketio import SocketIO
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import cv2
import numpy as np
import mysql.connector
from mysql.connector import Error
import base64
import json
from datetime import datetime,timedelta
import io
from PIL import Image




app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)


def get_db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='frs'
        )
        if conn.is_connected():
            print("Connection successful")
        else:
            print("Connection failed")
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    return conn





# Initialize face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def get_face_encoding(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return None
    
    # Get the largest face
    (x, y, w, h) = max(faces, key=lambda face: face[2] * face[3])
    
    # Extract face ROI and resize to standard size
    face_roi = image[y:y+h, x:x+w]
    face_roi = cv2.resize(face_roi, (128, 128))
    
    # Flatten the face ROI to create a simple encoding
    return face_roi.flatten()


        
        
#Student Registration API
@app.route('/api/register', methods=['POST'])
def register_student():
    try:
        # Extract JSON data from the request
        data = request.json
        
        # Input validation to check for missing fields
        required_fields = ['EnlNo', 'Name', 'Department', 'Course', 'Year', 
                           'Semester', 'Section', 'Gender', 'DOB', 'Email', 
                           'Phone', 'Address', 'faceImage']
        
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Process face image
        face_image_base64 = data['faceImage']
        try:
            face_image_data = base64.b64decode(face_image_base64.split(',')[1])
            nparr = np.frombuffer(face_image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            return jsonify({'error': f'Invalid image format: {str(e)}'}), 400

        face_encoding = get_face_encoding(image)
        if face_encoding is None:
            return jsonify({'error': 'No face detected in the image'}), 400

        # Database operation
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            query = """
            INSERT INTO student (
                Enrollment_No, Name, Department, Course, Year, Semester, 
                Section, Gender, DOB, Email, Phone, Address, face_encoding
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            # Insert the extracted data into the database
            cursor.execute(query, (
                data['EnlNo'], data['Name'], data['Department'], data['Course'],
                data['Year'], data['Semester'], data['Section'], data['Gender'],
                data['DOB'], data['Email'], data['Phone'], data['Address'],
                json.dumps(face_encoding.tolist())
            ))
            conn.commit()  # Commit the transaction
            
            return jsonify({'message': 'Student registered successfully'})
        
        except mysql.connector.IntegrityError as err:
            # Handle duplicate EnlNo or Email error
            if "EnlNo" in str(err):
                return jsonify({'error': 'Enrollment Number already exists'}), 400
            elif "Email" in str(err):
                return jsonify({'error': 'Email already exists'}), 400
            else:
                return jsonify({'error': f'Database error: {str(err)}'}), 500

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


    

#signup function
@app.route('/api/faculty/register', methods=['POST'])
def register_faculty():
    try:
        data = request.json
        
        # Input validation
        required_fields = ['First_Name', 'Last_Name', 'Contact', 'Email', 'Password', 'Subject']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Check if the email is unique
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM faculty WHERE Email = %s", (data['Email'],))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 400

        # Encrypt the password using the Bcrypt instance
        hashed_password = bcrypt.generate_password_hash(data['Password']).decode('utf-8')

        # Insert the faculty data
        query = """
        INSERT INTO faculty (First_Name, Last_Name, Contact, Email, Password, Subject) 
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['First_Name'], data['Last_Name'], data['Contact'],
            data['Email'], hashed_password, data['Subject']
        ))
        conn.commit()

        return jsonify({'message': 'Faculty registered successfully'})
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {str(err)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close() 
        if 'conn' in locals() and conn.is_connected():
            conn.close()


# login function
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        print(f"Received login request: {data}")  # Debugging print

        # Input validation
        if 'Email' not in data or 'Password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400

        email = data['Email']
        password = data['Password']

        # Check if the user exists
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM faculty WHERE Email = %s", (email,))
        user = cursor.fetchone()
        
        print(f"User found: {user}")  # Debugging print

        if user is None:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Verify the password
        if not bcrypt.check_password_hash(user['Password'], password):
            print("Password mismatch.")  # Debugging print
            return jsonify({'error': 'Invalid email or password'}), 401

        # Login successful
        return jsonify({'success': True, 'message': 'Login successful'}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {str(err)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close() 
        if 'conn' in locals() and conn.is_connected():
            conn.close()


#take Attendance function api
@app.route('/api/mark-attendance', methods=['POST'])
def mark_attendance():
    try:
        data = request.json
        if 'faceImage' not in data:
            return jsonify({'error': 'Face image is required'}), 400

        # Process face image
        face_image_data = base64.b64decode(data['faceImage'].split(',')[1])
        nparr = np.frombuffer(face_image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        face_encoding = get_face_encoding(image)
        if face_encoding is None:
            return jsonify({'error': 'No face detected in the image'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Get all registered students with their IDs, face encodings, and names
            cursor.execute("SELECT student_id, name, face_encoding FROM student")
            registered_students = cursor.fetchall()

            if not registered_students:
                return jsonify({'error': 'No registered students found'}), 404

            # Find matching face
            min_distance = float('inf')
            matched_student_id = None
            matched_student_name = None

            for student in registered_students:
                stored_encoding = np.array(json.loads(student['face_encoding']))
                distance = np.linalg.norm(stored_encoding - face_encoding)

                if distance < min_distance:
                    min_distance = distance
                    matched_student_id = student['student_id']
                    matched_student_name = student['name']  # Capture the student's name

            if min_distance < 20000 and matched_student_id:
                # Mark attendance with timestamp
                current_time = datetime.now()
                query = "INSERT INTO attendance (student_id, check_in) VALUES (%s, %s)"
                cursor.execute(query, (matched_student_id, current_time))
                conn.commit()

                return jsonify({
                    'message': f"Attendance marked successfully for {matched_student_name}!",  # Include the student's name
                    'student_name': matched_student_name
                })

            return jsonify({'error': 'Face not recognized'}), 404

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500
    

#View Attendance Record
@app.route('/api/attendance-records', methods=['GET'])
def get_attendance_records():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch the date filter type from the request (e.g., 'today', 'yesterday', or a specific date)
        date_filter = request.args.get('date_filter')

        query = """
        SELECT 
            attendance.attendance_id,
            student.Enrollment_No, 
            student.Name, 
            student.Email, 
            student.Course, 
            student.Section, 
            attendance.check_in,
            'Present' as status  -- Adjust status logic as needed
        FROM 
            attendance
        JOIN 
            student ON attendance.student_id = student.student_id
        """

        # Date filter logic
        if date_filter == 'today':
            query += " WHERE DATE(attendance.check_in) = CURDATE()"
        elif date_filter == 'yesterday':
            query += " WHERE DATE(attendance.check_in) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)"
        elif date_filter:  # Assume it's a specific date in 'YYYY-MM-DD' format
            query += " WHERE DATE(attendance.check_in) = %s"
            cursor.execute(query, (date_filter,))
        else:
            cursor.execute(query)

        # Execute the query and fetch results
        records = cursor.fetchall()

        if not records:
            return jsonify({'error': 'No attendance records found'}), 404

        return jsonify(records)

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

#export to csv file attendance record
@app.route('/api/export-attendance-csv', methods=['GET'])
def export_attendance_csv():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        date = request.args.get('date')

        query = """
        SELECT 
            student.Enrollment_No, 
            student.Name, 
            student.Email, 
            student.Course, 
            student.Section, 
            attendance.check_in,
            'Present' as status  -- Adjust status logic as needed
        FROM 
            attendance
        JOIN 
            student ON attendance.student_id = student.student_id
        """

        # Apply date filter if a date is provided
        if date:
            query += " WHERE DATE(attendance.check_in) = %s"
            cursor.execute(query, (date,))
        else:
            cursor.execute(query)

        records = cursor.fetchall()

        if not records:
            return jsonify({'error': 'No attendance records found'}), 404

        # Create a CSV file in memory
        output = io.StringIO()
        writer = csv.writer(output)

        # Write the header row
        writer.writerow(['EnlNo', 'Name', 'Email', 'Course', 'Section', 'Check-in Time', 'Status'])

        # Write the data rows
        for record in records:
            writer.writerow(record)

        # Create the response as a CSV file
        response = make_response(output.getvalue())
        response.headers["Content-Disposition"] = f"attachment; filename=attendance_records_{date or 'all'}.csv"
        response.headers["Content-Type"] = "text/csv"
        return response

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()



#fetch student data 
@app.route('/api/student-report/<Enrollment_No>', methods=['GET'])
def get_student_attendance_report(Enrollment_No):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT 
            student.Enrollment_No,
            student.Name,
            student.Email,
            student.Course,
            student.Section,
            attendance.check_in,
            attendance.status
        FROM 
            attendance
        JOIN 
            student ON attendance.student_id = student.student_id
        WHERE 
            student.Enrollment_No = %s
        """
        cursor.execute(query, (Enrollment_No,))
        records = cursor.fetchall()

        if not records:
            return jsonify({'error': 'No attendance records found for this student'}), 404

        return jsonify(records)

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


#API to Export Specific Student Attendance as CSV
@app.route('/api/export-student-csv/<Enrollment_No>', methods=['GET'])
def export_student_csv(Enrollment_No):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        SELECT 
            student.Enrollment_No, 
            student.Name, 
            student.Email, 
            student.Course, 
            student.Section, 
            attendance.check_in, 
            attendance.status
        FROM 
            attendance
        JOIN 
            student ON attendance.student_id = student.student_id
        WHERE 
            student.Enrollment_No = %s
        """
        cursor.execute(query, (Enrollment_No,))
        records = cursor.fetchall()

        if not records:
            return jsonify({'error': 'No attendance records found for this student'}), 404

        output = io.StringIO()
        writer = csv.writer(output)

        # Write the header row
        writer.writerow(['Enrollment_No', 'Name', 'Email', 'Course', 'Section', 'Check-in Time', 'Status'])

        # Write the data rows
        for record in records:
            writer.writerow(record)

        response = make_response(output.getvalue())
        response.headers["Content-Disposition"] = f"attachment; filename=student_report_{Enrollment_No}.csv"
        response.headers["Content-Type"] = "text/csv"
        return response

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


#faculty management to fetch records
@app.route('/api/faculty-records', methods=['GET'])
def get_faculty_records():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT 
            Employee_ID, 
            First_Name, 
            Last_Name, 
            Contact, 
            Email, 
            Subject
        FROM 
            faculty
        """
        cursor.execute(query)
        faculty_records = cursor.fetchall()

        if not faculty_records:
            return jsonify({'error': 'No faculty records found'}), 404

        return jsonify(faculty_records)

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

#to delete records from faculty
@app.route('/api/remove-faculty/<int:employee_id>', methods=['DELETE'])
def remove_faculty(employee_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the faculty exists
        cursor.execute("SELECT * FROM faculty WHERE Employee_ID = %s", (employee_id,))
        faculty = cursor.fetchone()

        if not faculty:
            return jsonify({'error': 'Faculty not found'}), 404

        # Delete the faculty member
        cursor.execute("DELETE FROM faculty WHERE Employee_ID = %s", (employee_id,))
        conn.commit()

        return jsonify({'message': 'Faculty removed successfully'})

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

































if __name__ == '__main__':
    app.run(port=5000, debug=True)
