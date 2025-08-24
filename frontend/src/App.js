import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import FormPage from './components/FormPage';
import ResultsPage from './components/ResultsPage';
import InfoPage from './components/InfoPage';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/informacion" element={<InfoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;