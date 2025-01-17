import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUploadForm from './component/userform'; // Adjust import path if needed


const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<FileUploadForm />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
