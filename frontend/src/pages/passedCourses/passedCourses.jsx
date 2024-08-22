import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './passedCourses.css';

const PassedCourses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { passedCourses, programName } = location.state || { passedCourses: [], programName: '' };

  const handleReturnToTranscript = () => {
    navigate(`/program/${programName}`);
  };

  const handleConfirmCourses = () => {
    navigate('/degree-requirements', { state: { passedCourses, programName } });
  };

  return (
    <div className="passed-courses">
      <h1>Valid Course Attempts for {programName}</h1>
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
      <button onClick={handleReturnToTranscript} className="action-button">
        Return to Transcript Parser
      </button>
      <button onClick={handleConfirmCourses} className="action-button confirm-button">
        Confirm Passed Courses
      </button>
    </div>
  );
};

export default PassedCourses;