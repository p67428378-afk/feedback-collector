import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import FormBuilder from './pages/FormBuilder';
import UserFormPage from './pages/UserFormPage';
import SubmissionsPage from './pages/SubmissionsPage';
import AllSubmissionsDashboard from './pages/AllSubmissionsDashboard'; // New import
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/forms/new">Create New Form</Link>
            </li>
            <li>
              <Link to="/admin/submissions/all">All Submissions</Link> {/* New Link */}
            </li>
            {/* Link to a sample user form - replace with dynamic links later */}
            <li>
              <Link to="/form/1">Sample User Form (ID 1)</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/forms/new" element={<FormBuilder />} />
          <Route path="/admin/forms/:formId/edit" element={<FormBuilder />} />
          <Route path="/admin/forms/:formId/submissions" element={<SubmissionsPage />} />
          <Route path="/admin/submissions/all" element={<AllSubmissionsDashboard />} /> {/* New Route */}
          <Route path="/form/:formId" element={<UserFormPage />} />
          <Route path="/" element={<h1>Welcome to the Anonymous Feedback System</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
