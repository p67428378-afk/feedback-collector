import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserFormPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setForm(data);
      // Initialize formData with empty values for each field
      const initialFormData = {};
      JSON.parse(data.fields).forEach(field => {
        initialFormData[field.label] = ''; // Use label as key for simplicity
      });
      setFormData(initialFormData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmissionStatus(null);

    try {
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setSubmissionStatus('success');
      // Optionally reset form
      const initialFormData = {};
      JSON.parse(form.fields).forEach(field => {
        initialFormData[field.label] = '';
      });
      setFormData(initialFormData);

    } catch (error) {
      setError(error.message);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading form...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!form) return <div className="container">Form not found.</div>;

  return (
    <div className="container">
      <h2>{form.title}</h2>
      <p>{form.description}</p>

      {submissionStatus === 'success' && (
        <div style={{ color: 'green' }}>Thank you for your feedback!</div>
      )}
      {submissionStatus === 'error' && (
        <div style={{ color: 'red' }}>Error submitting feedback. Please try again.</div>
      )}

      <form onSubmit={handleSubmit}>
        {JSON.parse(form.fields).map(field => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.label}
                value={formData[field.label] || ''}
                onChange={handleChange}
                required
              ></textarea>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                id={field.id}
                name={field.label}
                checked={formData[field.label] || false}
                onChange={handleChange}
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                name={field.label}
                value={formData[field.label] || ''}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <button type="submit" disabled={loading}>Submit Feedback</button>
      </form>
    </div>
  );
}

export default UserFormPage;
