import React, { useState } from 'react';

import './StudentInput.css';
import Card from '../UI/Card';

function StudentInput(props) {
  const [enteredStudentName, setEnteredStudentName] = useState('');
  const [enteredStudentGPA, setEnteredStudentGPA] = useState('');
  const [enteredStudentPic, setEnteredStudentPic] = useState(null);

  function updateStudentNameHandler(event) {
    setEnteredStudentName(event.target.value);
  }

  function updateStudentGPAHandler(event) {
    setEnteredStudentGPA(event.target.value);
  }

  function updateStudentPicHandler(event) {
    setEnteredStudentPic(event.target.files[0]);
  }

  function studentSubmitHandler(event) {
    event.preventDefault();

    if (enteredStudentName.trim().length === 0) {
      alert('Invalid text - please enter a longer one!');
      return;
    }

    if(isNaN(enteredStudentGPA)) {
      alert('Please enter a valid GPA');
    }

    props.onAddStudent({
      name: enteredStudentName,
      gpa: enteredStudentGPA,
      pic: enteredStudentPic
    });

    setEnteredStudentName('');
    setEnteredStudentGPA('');
    setEnteredStudentPic(null);
  }

  return (
    <section id='student-input'>
      <Card>
        <form onSubmit={studentSubmitHandler} >
          <label htmlFor='name'>Student Name:</label>
          <input
            type='text'
            id='name'
            value={enteredStudentName}
            onChange={updateStudentNameHandler}
          />
          <label htmlFor='gpa'>Student GPA:</label>
          <input
            type='text'
            id='gpa'
            value={enteredStudentGPA}
            onChange={updateStudentGPAHandler}
          />
          <label htmlFor="pic">Student Pic:</label>
          <input 
            type="file"
            id="pic"
            // value={enteredStudentPic}
            onChange={updateStudentPicHandler}
            accept="image/*"
          />
          <button>Add Student</button>
        </form>
      </Card>
    </section>
  );
}

export default StudentInput;
