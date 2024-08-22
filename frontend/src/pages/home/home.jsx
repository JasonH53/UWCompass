import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const programs = [
  'Computer Science',
  'Financial Analysis and Risk Management',
  'Actuarial science',
  'Statistics',
  'Mathematical Finance',
  'Mathematical Studies',
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
    if (programs.includes(search)) {
      navigate(`/program/${encodeURIComponent(search)}`);
    } else {
      setError('Invalid course. Please select a valid program.');
    }
  };

  const handleSuggestionClick = (program) => {
    setSearch(program);
    setSuggestions([]);
    setError('');
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
    </div>
  );
};

export default Home;