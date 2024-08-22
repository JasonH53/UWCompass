import React, { useState, useEffect } from 'react';
import './Parser.css';

const Parser = ({ onParseComplete }) => {
  const [transcript, setTranscript] = useState('');

  const parseTranscript = (text) => {
    const lines = text.split('\n');
    const courses = [];
    const courseRegex = /^([A-Z]+\s\d+[A-Z]?)\s+(.+?)\s+([\d.]+)\s+([\d.]+)\s+(\d+|CR)$/;

    let currentCourse = null;

    lines.forEach((line, index) => {
      const match = line.match(courseRegex);
      if (match) {
        const [, code, description, attempted, earned, grade] = match;
        if (attempted === earned && parseFloat(attempted) !== 0) {
          courses.push({ code, description: description.trim(), earned, grade });
        }
        currentCourse = null;
      } else if (currentCourse) {
        // Continuation check
        const gradeMatch = line.match(/^([\d.]+)\s+([\d.]+)\s+(\d+|CR)$/);
        if (gradeMatch) {
          const [, attempted, earned, grade] = gradeMatch;
          if (attempted === earned && parseFloat(attempted) !== 0) {
            currentCourse.earned = earned;
            currentCourse.grade = grade;
            courses.push(currentCourse);
          }
          currentCourse = null;
        } else {
          currentCourse.description += ' ' + line.trim();
        }
      } else {
        // Multiline description 
        const courseStartMatch = line.match(/^([A-Z]+\s\d+[A-Z]?)\s+(.+)$/);
        if (courseStartMatch) {
          currentCourse = {
            code: courseStartMatch[1],
            description: courseStartMatch[2].trim()
          };
        }
      }
    });

    onParseComplete(courses);
  };

  useEffect(() => {
    if (transcript.trim()) {
      parseTranscript(transcript);
    }
  });

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    setTranscript(pastedText);
  };

  return (
    <div className="transcript-parser">
      <h2>Transcript Parser</h2>
      <p>Please paste your transcript below:</p>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        onPaste={handlePaste}
        placeholder="Paste your transcript here..."
        rows="10"
        cols="50"
      />
      <p>Your transcript data is processed locally, none of your data is saved.</p>
    </div>
  );
};

export default Parser;