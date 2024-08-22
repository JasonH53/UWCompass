import React from 'react';
import { useLocation } from 'react-router-dom';
// import './DegreeRequirements.css';

const DegreeRequirements = () => {
  const location = useLocation();
  const { passedCourses, programName } = location.state || { passedCourses: [], programName: '' };

  // This is a placeholder. You would replace this with actual degree requirements logic
  const checkRequirements = () => {
    // Example logic
    return {
      totalCredits: passedCourses.length * 0.5, // Assuming each course is 3 credits
      requiredCredits: 20,
      coreCoursesMet: false,
      electivesMet: false,
    };
  };

  const requirements = checkRequirements();

  return (
    <div className="degree-requirements">
      <h1>{programName} Degree Requirements</h1>
      <div className="requirements-summary">
        <h2>Summary</h2>
        <p>Total Credits: {requirements.totalCredits} / {requirements.requiredCredits}</p>
        <p>Core Courses: {requirements.coreCoursesMet ? 'Met' : 'Not Met'}</p>
        <p>Electives: {requirements.electivesMet ? 'Met' : 'Not Met'}</p>
      </div>
      <div className="courses-list">
        <h2>Passed Courses</h2>
        <ul>
          {passedCourses.map((course, index) => (
            <li key={index}>{course.code}: {course.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DegreeRequirements;