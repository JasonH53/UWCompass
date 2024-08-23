import React, { useState } from 'react';
import pdfToText from 'react-pdftotext';
import './Parser.css';

const Parser = ({ onParseComplete }) => {
  // eslint-disable-next-line
  const [transcript, setTranscript] = useState('');

  const extractText = (event) => {
    const file = event.target.files[0];
    pdfToText(file)
      .then(text => {
        setTranscript(text);
        parseTranscript(text);
      })
      .catch(error => console.error("Failed to extract text from pdf", error));
  };

  const parseTranscript = (text) => {
    console.log("Raw transcript text:", text);
    
    // Remove extra spaces and split by course codes
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    const courseRegex = /([A-Z]+\s+\d+[A-Z]?)/g;
    const courseSections = cleanedText.split(courseRegex);
    console.log("Course sections:", courseSections);
  
    const courses = [];
  
    for (let i = 1; i < courseSections.length; i += 2) {
      const courseCode = courseSections[i].trim();
      const courseDetails = courseSections[i + 1].trim();
  
      console.log("Processing course:", courseCode, courseDetails);
  
      const detailsMatch = courseDetails.match(/(.+?)\s+([\d.]+)\s+([\d.]+)\s+([A-Z+-]+|\d+(\.\d+)?|CR)$/);
  
      if (detailsMatch) {
        const [, description, attempted, earned, grade] = detailsMatch;
        
        if (attempted === earned && parseFloat(attempted) !== 0) {
          const course = {
            code: courseCode,
            description: description.trim(),
            earned,
            grade
          };
          courses.push(course);
          console.log("Added course:", course);
        }
      } else {
        console.log("Could not parse details for course:", courseCode);
      }
    }
  
    console.log(courses);
    onParseComplete(courses);
  };
    

  return (
    <div className="transcript-parser">
      <h2>Transcript Parser</h2>
      <p>Please upload your transcript.</p>
      <label htmlFor="transcript-upload">
        Upload PDF
        <input 
          id="transcript-upload"
          type="file" 
          accept="application/pdf" 
          onChange={extractText} 
        />
      </label>
      <p>Your transcript data is processed locally, none of your data is saved on UWCompass</p>
    </div>
  );
};

export default Parser;