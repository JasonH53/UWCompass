import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const programs = [
  'BCS, Computer Science',
  'BCS, Data Science',
  'BMath, Computer Science',
  'BMath, Financial Analysis and Risk Management',
  'BMath, Actuarial science',
  'BMath, Statistics',
  'BMath, Mathematical Finance',
  'BMath, Mathematical Studies',
  'BMath, General'
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToProgram(search);
  };

  const navigateToProgram = (program) => {
    if (programs.includes(program)) {
      navigate(`/program/${encodeURIComponent(program)}`);
    } else {
      setError('Invalid course. Please select a valid program.');
    }
  };

  const handleSuggestionClick = (program) => {
    setSearch(program);
    setSuggestions([]);
    setError('');
    navigateToProgram(program);
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
      </form>
      <footer className="footer">
        UWCompass 2024. All rights reserved. Built by <a href="https://jasonhon.com" target="_blank" rel="noopener noreferrer">Jason</a>
      </footer>
    </div>
  );
};

export default Home;