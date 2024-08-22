import React from 'react';
import './DegreeReq.css';
import breadthDepthData from './breadthDepth.json';
import degreeData from './degreeData.json';

const DegreeReq = ({ programName, passedCourses }) => {
  const getProgramRequirements = (program) => {
    const requirements = degreeData[program];
    if (!requirements) {
      return null;
    }
    if (requirements.extends) {
      const baseRequirements = getProgramRequirements(requirements.extends);
      if (baseRequirements) {
        // Recursively merge the requirements
        return mergeRequirements(baseRequirements, requirements);
      }
      return null;
    }
    return requirements;
  };

  const mergeRequirements = (base, extension) => {
    const merged = { ...base };

    for (const key in extension) {
      if (key === 'extends') continue;

      if (Array.isArray(extension[key])) {
        merged[key] = [...(merged[key] || []), ...extension[key]];
      } else if (typeof extension[key] === 'object' && extension[key] !== null) {
        merged[key] = mergeRequirements(merged[key] || {}, extension[key]);
      } else {
        merged[key] = extension[key];
      }
    }

    return merged;
  };

  const programRequirements = getProgramRequirements(programName);


  if (!programRequirements) {
    return (
      <div className="degree-requirements error">
        <h2>Error: Program Not Found</h2>
        <p>The program "{programName}" is not found in the degree database or not implemented yet. Please check the program name and try again. (I only added BCS, CS, and BCS DS, and Stats</p>
      </div>
    );
  }

  const checkRequirements = () => {
    const totalCredits = passedCourses.reduce((sum, course) => sum + Number(course.earned), 0);
    const csCourses = passedCourses.filter(course => course.code.startsWith('CS'));
    const mathCourses = passedCourses.filter(course => 
      course.code.startsWith('CS') || course.code.startsWith('MATH') || course.code.startsWith('STAT')
    );
    const csMajorAverage = calculateAverage(csCourses);
    const mathMajorAverage = calculateAverage(mathCourses);
  
    const coreCoursesMet = checkCoreCourses();
    const additionalRequirements = checkAdditionalRequirements();
    const breadthAndDepth = checkBreadthAndDepth();
    const communicationRequirement = checkCommunicationRequirement();
  
    return {
      totalCredits,
      requiredCredits: programRequirements.requiredCredits || 0,
      coreCoursesMet,
      additionalRequirements,
      breadthAndDepth,
      communicationRequirement,
      csMajorAverage: programRequirements.minimumAverages?.csMajor ? csMajorAverage : null,
      mathMajorAverage: programRequirements.minimumAverages?.mathMajor ? mathMajorAverage : null,
    };
  };

  const calculateAverage = (courses) => {
    if (courses.length === 0) return 0;
    
    const validCourses = courses.filter(course => 
      course.grade !== undefined && !isNaN(Number(course.grade))
    );
    
    if (validCourses.length === 0) return 0;
    
    const totalGrade = validCourses.reduce((sum, course) => sum + Number(course.grade), 0);
    return (totalGrade / validCourses.length).toFixed(2);
  };

  const normalizeCourseCode = (code) => {
    return code.replace(/\s+/g, '').toUpperCase();
  };

  const checkCoreCourses = () => {
    if (!programRequirements.coreCourses || !Array.isArray(programRequirements.coreCourses)) {
      console.warn('Core courses not defined or not an array:', programRequirements.coreCourses);
      return [];
    }
    return programRequirements.coreCourses.map(course => {
      if (Array.isArray(course)) {
        return course.some(c => passedCourses.some(pc => normalizeCourseCode(pc.code) === normalizeCourseCode(c)));
      }
      return passedCourses.some(pc => normalizeCourseCode(pc.code) === normalizeCourseCode(course));
    });
  };

  const checkAdditionalRequirements = () => {
    if (!programRequirements.additionalRequirements) return [];
    if (!Array.isArray(programRequirements.additionalRequirements)) {
      console.warn('additionalRequirements is not an array:', programRequirements.additionalRequirements);
      return [];
    }
    
    return programRequirements.additionalRequirements.map(req => {
      if (req.options) {
        return {
          name: req.name,
          met: req.options.some(option => 
            passedCourses.filter(course => option.courses.includes(course.code)).length >= option.count
          ),
          details: req.options.map(option => {
            const metCount = passedCourses.filter(course => option.courses.includes(course.code)).length;
            return `${option.name}: ${metCount}/${option.count}`;
          }).join(', ')
        };
      } else if (req.courses && req.count) {
        const metCount = passedCourses.filter(course => req.courses.includes(course.code)).length;
        return {
          name: req.name,
          met: metCount >= req.count,
          details: `${metCount}/${req.count}`
        };
      } else {
        console.warn('Unexpected requirement structure:', req);
        return null;
      }
    }).filter(Boolean);
  };

  const checkBreadthAndDepth = () => {
    if (!programRequirements.breadthAndDepth) return null;

    const countCourses = (category) => 
      passedCourses.filter(course => 
        breadthDepthData[category].some(prefix => course.code.startsWith(prefix))
      ).length;

    const humanities = countCourses('humanities');
    const pureSciences = countCourses('pureSciences');
    const socialSciences = countCourses('socialSciences');

    // TODO: Implement depth requirement logic
    const depthRequirement = false;

    return {
      humanities: humanities >= (programRequirements.breadthAndDepth.humanities || 0),
      pureSciences: pureSciences >= (programRequirements.breadthAndDepth.pureSciences || 0),
      socialSciences: socialSciences >= (programRequirements.breadthAndDepth.socialSciences || 0),
      depthRequirement: depthRequirement
    };
  };

  const checkCommunicationRequirement = () => {
    if (!programRequirements.communicationRequirement) return null;

    const list1Course = passedCourses.some(course => 
      programRequirements.communicationRequirement.list1.includes(course.code)
    );

    const list2Course = passedCourses.some(course => 
      programRequirements.communicationRequirement.list2.option2.includes(course.code)
    ) || (list1Course && programRequirements.communicationRequirement.list2.option1 === "Complete 1 additional course from List 1");

    return {
      list1: list1Course,
      list2: list2Course
    };
  };

  const requirements = checkRequirements();

  return (
    <div className="degree-requirements">
      <h2>{programName} Degree Requirements</h2>
      <div className="requirements-summary">
        <h3>Summary</h3>
        <p>Total Credits: <span className={requirements.totalCredits >= requirements.requiredCredits ? 'met' : 'not-met'}>{requirements.totalCredits} / {requirements.requiredCredits}</span></p>
        {programRequirements.minimumAverages && (
          <>
            {programRequirements.minimumAverages.csMajor && (
              <p>CS Major Average: <span className={requirements.csMajorAverage >= programRequirements.minimumAverages.csMajor ? 'met' : 'not-met'}>{requirements.csMajorAverage}%</span> (Minimum required: {programRequirements.minimumAverages.csMajor}%)</p>
            )}
            {programRequirements.minimumAverages.mathMajor && (
              <p>Math Major Average: <span className={requirements.mathMajorAverage >= programRequirements.minimumAverages.mathMajor ? 'met' : 'not-met'}>{requirements.mathMajorAverage}%</span> (Minimum required: {programRequirements.minimumAverages.mathMajor}%)</p>
            )}
          </>
        )}
      </div>
      {programRequirements.coreCourses && programRequirements.coreCourses.length > 0 && (
        <div className="core-courses">
          <h3>Core Courses</h3>
          <ul>
            {programRequirements.coreCourses.map((course, index) => (
              <li key={index} className={requirements.coreCoursesMet[index] ? 'met' : 'not-met'}>
                {Array.isArray(course) ? course.join(' or ') : course}: {requirements.coreCoursesMet[index] ? 'Met' : 'Not Met'}
              </li>
            ))}
          </ul>
        </div>
      )}
      {requirements.additionalRequirements && requirements.additionalRequirements.length > 0 && (
        <div className="additional-requirements">
          <h3>Additional Requirements</h3>
          {requirements.additionalRequirements.map((req, index) => (
            <p key={index} className={req.met ? 'met' : 'not-met'}>
              {req.name}: {req.met ? 'Met' : 'Not Met'} ({req.details})
            </p>
          ))}
        </div>
      )}
      {requirements.breadthAndDepth && (
        <div className="breadth-and-depth">
          <h3>Breadth and Depth Requirements</h3>
          <p className={requirements.breadthAndDepth.humanities ? 'met' : 'not-met'}>Humanities ({programRequirements.breadthAndDepth.humanities} courses): {requirements.breadthAndDepth.humanities ? 'Met' : 'Not Met'}</p>
          <p className={requirements.breadthAndDepth.pureSciences ? 'met' : 'not-met'}>Pure Sciences ({programRequirements.breadthAndDepth.pureSciences} courses): {requirements.breadthAndDepth.pureSciences ? 'Met' : 'Not Met'}</p>
          <p className={requirements.breadthAndDepth.socialSciences ? 'met' : 'not-met'}>Social Sciences ({programRequirements.breadthAndDepth.socialSciences} courses): {requirements.breadthAndDepth.socialSciences ? 'Met' : 'Not Met'}</p>
          <p className={requirements.breadthAndDepth.depthRequirement ? 'met' : 'not-met'}>Depth Requirement: {requirements.breadthAndDepth.depthRequirement ? 'Met' : 'Not Met'}</p>
        </div>
      )}
      {requirements.communicationRequirement && (
        <div className="communication-requirement">
          <h3>Communication Requirement</h3>
          <p className={requirements.communicationRequirement.list1 ? 'met' : 'not-met'}>List 1 Course: {requirements.communicationRequirement.list1 ? 'Met' : 'Not Met'}</p>
          <p className={requirements.communicationRequirement.list2 ? 'met' : 'not-met'}>List 2 Course: {requirements.communicationRequirement.list2 ? 'Met' : 'Not Met'}</p>
        </div>
      )}
      <div className="courses-list">
        <h3>Passed Courses</h3>
        <ul>
          {passedCourses.map((course, index) => (
            <li key={index}>{course.code}: {course.description} (Grade: {course.grade}, Credits: {course.earned})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DegreeReq;