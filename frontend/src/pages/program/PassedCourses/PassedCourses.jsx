import React from 'react';
import './PassedCourses.css';

const PassedCourses = ({ programName, passedCourses, onConfirm, onReturn }) => {
  return (
    <div className="passed-courses">
      <h2>Valid Course Attempts for {programName}</h2>
      {passedCourses.length > 0 ? (
        <ul>
          {passedCourses.map((course, index) => (
            <li key={index}>
              <strong>{course.code}</strong>: {course.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No passed courses found.</p>
      )}
      <button onClick={onReturn} className="action-button">
        Return to Transcript Parser
      </button>
      <button onClick={onConfirm} className="action-button confirm-button">
        Confirm Passed Courses
      </button>
    </div>
  );
};

export default PassedCourses;