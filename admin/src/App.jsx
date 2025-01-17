import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminLoginForm from "./components/AdminLoginForm";
import Dashboard from "./components/AdminDashboard";

const App = () => {
  // const isLoggedIn = false; // Static login state for demonstration

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
        {/* Remove the /logout route if no LandingPage is defined */}
      </Routes>
    </Router>
  );
};

export default App;
