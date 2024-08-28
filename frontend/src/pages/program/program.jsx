import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Parser from './Parser/Parser';
import PassedCourses from './PassedCourses/PassedCourses';
import DegreeReq from './DegreeReq/DegreeReq';

const Program = () => {
  const { programNames } = useParams();
  const [currentView, setCurrentView] = useState('parser');
  const [passedCourses, setPassedCourses] = useState([]);

  const handleParseComplete = (courses) => {
    setPassedCourses(courses);
    setCurrentView('passedCourses');
  };

  const handleConfirmCourses = () => {
    setCurrentView('degreeRequirements');
  };

  const handleReturnToParser = () => {
    setCurrentView('parser');
  };

  const renderComponent = () => {
    if (!programNames) {
      return <div>Error: Program names are not defined.</div>;
    }

    // Decode and split the program names correctly
    const programsArray = decodeURIComponent(programNames).split(',').map(program => program.trim());
    
    // Reassemble full program names every two parts
    const fullPrograms = [];
    for (let i = 0; i < programsArray.length; i += 2) {
      if (programsArray[i + 1]) {
        fullPrograms.push(`${programsArray[i]}, ${programsArray[i + 1]}`);
      }
    }

    switch (currentView) {
      case 'parser':
        return <Parser programNames={fullPrograms} onParseComplete={handleParseComplete} />;
      case 'passedCourses':
        return <PassedCourses programNames={fullPrograms} passedCourses={passedCourses} onConfirm={handleConfirmCourses} onReturn={handleReturnToParser} />;
      case 'degreeRequirements':
        return <DegreeReq programNames={fullPrograms} passedCourses={passedCourses} />;
      default:
        return <Parser programNames={fullPrograms} onParseComplete={handleParseComplete} />;
    }
  };

  return (
    <div className="program">
      {renderComponent()}
    </div>
  );
};

export default Program;