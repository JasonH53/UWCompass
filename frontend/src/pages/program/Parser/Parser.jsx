import React, { useState } from 'react';
import pdfToText from 'react-pdftotext';
import './Parser.css';

const Parser = ({ onParseComplete }) => {
  const [errorPopup, setErrorPopup] = useState('');

  const extractText = (event) => {
    const file = event.target.files[0];
    pdfToText(file)
      .then(text => {
        parseTranscript(text);
      })
      .catch(error => setErrorPopup("Failed to extract text from PDF, ensure that it is not password protected"));
  };

  const parseTranscript = (text) => {
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    const courseRegex = /([A-Z]+\s+\d+[A-Z]?)\s+(.+?)\s+([\d.]+)\s+([\d.]+)\s+([A-Z+-]+|\d+(\.\d+)?|CR)|([A-Z]+\s+\d+[A-Z]?)\s+Transfer\s+Credit\s+Earned\s+([\d.]+)/g;
    const courses = [];
    let match;

    while ((match = courseRegex.exec(cleanedText)) !== null) {
      if (match[1]) {
        const [, courseCode, description, attempted, earned, grade] = match;
        
        if (attempted === earned && parseFloat(attempted) !== 0) {
          const course = {
            code: courseCode,
            description: description.trim(),
            earned,
            grade
          };
          courses.push(course);
        }
      } else if (match[7]) {
        const courseCode = match[7];
        const earned = match[8];
        const course = {
          code: courseCode,
          description: "Transfer Credit",
          earned,
          grade: "TR"
        };
        courses.push(course);
      }
    }

    if (courses.length === 0) {
      setErrorPopup("Could not parse any course details.");
    } else {
      onParseComplete(courses);
    }
  };

  const closeErrorPopup = () => {
    setErrorPopup('');
  };

  return (
    <div className="transcript-parser">
      <h2>Transcript Parser</h2>
      <p>Please upload your transcript.</p>
      <label htmlFor="transcript-upload">
        Upload PDF
        <input id="transcript-upload" type="file" accept="application/pdf" onChange={extractText} />
      </label>
      <p>Your transcript data is processed locally, none of your data is saved on UWCompass. Make sure your transcript PDF is not password protected.</p>

      {errorPopup && (
        <div className="error-popup">
          <span>{errorPopup}</span>
          <button onClick={closeErrorPopup}>&times;</button>
        </div>
      )}
    </div>
  );
};

export default Parser;