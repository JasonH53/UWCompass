import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

// Hard coded for now
const programs = [
  'BCS, Computer Science',
  'BCS, Data Science',
  'BMath, Computer Science',
  'BMath, Financial Analysis and Risk Management',
  'BMath, Actuarial science',
  'BMath, Statistics',
  'BMath, Mathematical Finance',
  'BMath, Mathematical Studies',
  'BMath, Applied Mathematics',
  'BMath, Computational Mathematics',
  'BMath, Data Science',
  'BMath, Information Technology Management',
  'BMath, Mathematical Economics',
  'BMath, Mathematical Physics',
  'BMath, Business Administration',
  'BMath, Chartered Professional Accountancy',
  'BMath, Teaching',
  'BMath, Pure Mathematics',
  'BMath, Combinatorics and Optimization',
  'BMath, General'
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setError('');

    if (value.length > 0) {
      const filteredSuggestions = programs.filter(program =>
        program.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (program) => {
    if (!selectedPrograms.includes(program)) {
      setSelectedPrograms([...selectedPrograms, program]);
    }
    setSearch('');
    setSuggestions([]);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPrograms.length > 0) {
      navigateToProgram(selectedPrograms.join(','));
    } else {
      setError('Please select at least one program.');
    }
  };

  const navigateToProgram = (programs) => {
    const validPrograms = programs.split(',').filter(program => programs.includes(program.trim()));
    if (validPrograms.length > 0) {
      navigate(`/program/${encodeURIComponent(validPrograms.join(','))}`);
    } else {
      setError('Invalid course. Please select a valid program.');
    }
  };

  return (
    <div className="home-container">
      <h1>UW Compass</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Enter your program name (e.g. Computer Science)"
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((program, index) => (
              <li key={index} onClick={() => handleSuggestionClick(program)}>
                {program}
              </li>
            ))}
          </ul>
        )}
        {selectedPrograms.length > 0 && (
          <div className="selected-programs">
            <h3>Selected Program(s): (Compatible with multiple majors)</h3>
            <ul>
              {selectedPrograms.map((program, index) => (
                <li key={index}>{program}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
      <footer className="footer">
        UWCompass 2024. All rights reserved. Built by <a href="https://jasonhon.com" target="_blank" rel="noopener noreferrer">Jason</a>
      </footer>
    </div>
  );
};

export default Home;