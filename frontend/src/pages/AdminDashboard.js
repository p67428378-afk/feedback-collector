import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setForms(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form and all its submissions?')) {
      try {
        const response = await fetch(`/api/forms/${formId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setForms(forms.filter(form => form.id !== formId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) return <div className="container">Loading forms...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/forms/new" className="button">Create New Form</Link>
      <h3>Existing Forms</h3>
      {forms.length === 0 ? (
        <p>No forms created yet. Create one to get started!</p>
      ) : (
        <div className="form-list">
          <ul>
            {forms.map(form => (
              <li key={form.id}>
                <span>{form.title}</span>
                <div>
                  <Link to={`/admin/forms/${form.id}/edit`} className="button edit">Edit</Link>
                  <Link to={`/admin/forms/${form.id}/submissions`} className="button submissions">View Submissions</Link>
                  <button onClick={() => handleDelete(form.id)} className="delete">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
