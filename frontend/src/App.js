import React, { useState, useEffect } from 'react';

import StudentInput from './components/students/StudentInput';
import StudentList from './components/students/StudentList';
import ErrorAlert from './components/UI/ErrorAlert';

function App() {
  const [loadedStudents, setLoadedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost/students');

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || 'Fetching the students failed.');
        }

        setLoadedStudents(resData.students);
      } catch (err) {
        setError(
          err.message ||
            'Fetching students failed - the server responsed with an error.'
        );
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  async function addStudentHandler(student) {
    setIsLoading(true);

    const data = new FormData();
    data.append('file',student.pic);
    data.append('name',student.name);
    data.append('gpa',student.gpa);

    try {
      const response = await fetch('http://localhost/students', {
        method: 'POST',
        body: data,
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Adding the student failed.');
      }

      setLoadedStudents((prevStudents) => {
        const updatedStudents = [
          {
            id: resData.student.id,
            name: student.name,
            gpa: student.gpa,
            pic: student.pic
          },
          ...prevStudents,
        ];
        return updatedStudents;
      });
    } catch (err) {
      setError(
        err.message ||
          'Adding a student failed - the server responsed with an error.'
      );
    }
    setIsLoading(false);
  }

  async function deleteStudentHandler(studentId) {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/students/' + studentId, {
        method: 'DELETE',
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Deleting the student failed.');
      }

      setLoadedStudents((prevStudents) => {
        const updatedStudents = prevStudents.filter((student) => student.id !== studentId);
        return updatedStudents;
      });
    } catch (err) {
      setError(
        err.message ||
          'Deleting the student failed - the server responsed with an error.'
      );
    }
    setIsLoading(false);
  }

  return (
    <div>
      {error && <ErrorAlert errorText={error} />}
      <StudentInput onAddStudent={addStudentHandler} />
      {!isLoading && (
        <StudentList students={loadedStudents} onDeleteStudent={deleteStudentHandler} />
      )}
    </div>
  );
}

export default App;
