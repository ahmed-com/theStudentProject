import React from 'react';

import './StudentList.css';
import Card from '../UI/Card';
import StudentRow from './StudentRow';

function StudentList(props) {
	const hasNoStudents = !props.students || props.students.length === 0;

	return (
		<section id="student-list">
			<Card>
				<h2>Current Sudents :</h2>
				{hasNoStudents && <h2>No Students Were Found!</h2>}
				<table id="student-list-table">
					<tr>
						<th>Picture</th>
						<th>ID</th>
						<th>Name</th>
						<th>GPA</th>
					</tr>
					{props.students.map(student=>(
						<StudentRow
							key={student.id}
							id={student.id}
							name={student.name}
							gpa={student.gpa}
							pic={student.pic}
							onDelete={props.onDeleteStudent}
						/>
					))}
				</table>
			</Card>
		</section>
	);
}

export default StudentList;
