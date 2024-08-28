import React, { useState, useEffect } from 'react';
import './PassedCourses.css';

const PassedCourses = ({ programName, passedCourses, onConfirm, onReturn }) => {
  const [showForm, setShowForm] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [credits, setCredits] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const addCourse = (e) => {
    e.preventDefault(); // Prevent form submission
    const course = {
      code: courseCode,
      description: 'Transfer Credit',
      earned: parseFloat(credits),
      grade: 'CR'
    };
    passedCourses.push(course);
    setCourseCode('');
    setCredits('');
    setShowForm(false);
    setShowPopup(true);
  };

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
      <p>Note: Transfer credits must be manually added</p>
      <button onClick={() => setShowForm(true)} className="action-button add-course-button">
        Course not found? Add Here!
      </button>
      {showForm && (
        <div className="add-course-overlay">
          <form onSubmit={addCourse} className="add-course-form">
            <h3>Add New Course</h3>
            <input
              type="text"
              name="code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Course Code"
              required
            />
            <input
              type="number"
              name="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Credits"
              required
            />
            <div className="form-buttons">
              <button type="submit" className="action-button">Add</button>
              <button type="button" onClick={() => setShowForm(false)} className="action-button cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <button onClick={onReturn} className="action-button">
        Return to Transcript Parser
      </button>
      <button onClick={onConfirm} className="action-button confirm-button">
        Confirm Courses
      </button>
      {showPopup && (
        <div className="popup">
          Course added successfully!
        </div>
      )}
    </div>
  );
};

export default PassedCourses;