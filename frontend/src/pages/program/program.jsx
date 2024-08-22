import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './program.css';

const Program = () => {
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();
  const { programName } = useParams();

  const parseTranscript = (text) => {
    const lines = text.split('\n');
    const courses = [];
    const courseRegex = /^([A-Z]+\s\d+)\s+(.+?)\s+([\d.]+)\s+([\d.]+)\s+(\d+|CR)$/;

    lines.forEach(line => {
      const match = line.match(courseRegex);
      if (match) {
        // eslint-disable-next-line
        const [_, code, description, , , grade] = match;
        if (grade === 'CR' || parseFloat(grade) >= 50) {
          courses.push({ code, description, grade });
        }
      }
    });
    
    navigate('/passed-courses', { state: { passedCourses: courses, programName } });
  };

  const handleTranscriptChange = (e) => {
    const newTranscript = e.target.value;
    setTranscript(newTranscript);
    if (newTranscript.trim()) {
      parseTranscript(newTranscript);
    }
  };

  return (
    <div className="transcript-parser">
      <h1>{programName} Program</h1>
      <p>Please paste your transcript below:</p>
      <textarea
        value={transcript}
        onChange={handleTranscriptChange}
        placeholder="Paste your transcript here..."
        rows="10"
        cols="50"
      />
    </div>
  );
};

export default Program;