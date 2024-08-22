import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import Program from './pages/program/program';
import PassedCourses from './pages/passedCourses/passedCourses';
import DegreeRequirements from './pages/degreeRequirements/degreeRequirements';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
      <ParticleBackground />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/program/:programName" element={<Program />} />
          <Route path="/passed-courses" element={<PassedCourses />} />
          <Route path="/degree-requirements" element={<DegreeRequirements />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;