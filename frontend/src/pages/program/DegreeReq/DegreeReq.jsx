import React from 'react';

const DegreeReq = ({ programName, passedCourses }) => {
  const checkRequirements = () => {
    const totalCredits = passedCourses.reduce((sum, course) => sum + Number(course.earned), 0);
    return {
      totalCredits: totalCredits,
      requiredCredits: 20,
      coreCoursesMet: false,
      electivesMet: false,
    };
  };

  const requirements = checkRequirements();

  return (
    <div className="degree-requirements">
      <h2>Degree Requirements</h2>
      <div className="requirements-summary">
        <h3>Summary</h3>
        <p>Total Credits: {requirements.totalCredits} / {requirements.requiredCredits}</p>
        <p>Core Courses: {requirements.coreCoursesMet ? 'Met' : 'Not Met'}</p>
        <p>Electives: {requirements.electivesMet ? 'Met' : 'Not Met'}</p>
      </div>
      <div className="courses-list">
        <h3>Passed Courses</h3>
        <ul>
          {passedCourses.map((course, index) => (
            <li key={index}>{course.code}: {course.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DegreeReq;