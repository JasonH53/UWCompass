import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import Program from './pages/program/program';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;