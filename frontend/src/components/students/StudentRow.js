import React from 'react';

import './StudentRow.css';

function StudentRow(props) {
	const picURL = `http://localhost/images/${props.pic}`
	console.log(props);
	return (
		<tr className="student-row" onClick={props.onDelete.bind(null, props.id)}>
			<td><img src={picURL} alt="not found" /></td>
			<td>{props.id}</td>
			<td>{props.name}</td>
			<td>{props.gpa}</td>
		</tr>
	)
}

export default StudentRow;
