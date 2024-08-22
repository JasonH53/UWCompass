import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Parser from './Parser/Parser';
import PassedCourses from './PassedCourses/PassedCourses';
import DegreeReq from './DegreeReq/DegreeReq';

const Program = () => {
  const { programName } = useParams();
  const [currentView, setCurrentView] = useState('parser');
  const [passedCourses, setPassedCourses] = useState([]);

  const renderComponent = () => {
    switch (currentView) {
      case 'parser':
        return <Parser programName={programName} onParseComplete={handleParseComplete} />;
      case 'passedCourses':
        return <PassedCourses programName={programName} passedCourses={passedCourses} onConfirm={handleConfirmCourses} onReturn={handleReturnToParser} />;
      case 'degreeRequirements':
        return <DegreeReq programName={programName} passedCourses={passedCourses} />;
      default:
        return <Parser programName={programName} onParseComplete={handleParseComplete} />;
    }
  };

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

  return (
    <div className="program">

      {renderComponent()}
    </div>
  );
};

export default Program;