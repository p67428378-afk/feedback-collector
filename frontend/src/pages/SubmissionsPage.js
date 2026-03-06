import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SubmissionsPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFormAndSubmissions();
  }, [formId]);

  const fetchFormAndSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch form details
      const formResponse = await fetch(`/api/forms/${formId}`);
      if (!formResponse.ok) {
        throw new Error(`HTTP error! status: ${formResponse.status}`);
      }
      const formData = await formResponse.json();
      setForm(formData);

      // Fetch submissions for the form
      const submissionsResponse = await fetch(`/api/forms/${formId}/submissions`);
      if (!submissionsResponse.ok) {
        throw new Error(`HTTP error! status: ${submissionsResponse.status}`);
      }
      const submissionsData = await submissionsResponse.json();
      setSubmissions(submissionsData);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading submissions...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!form) return <div className="container">Form not found.</div>;

  return (
    <div className="container">
      <h2>Submissions for: {form.title}</h2>
      <p>{form.description}</p>

      <h3>Raw Submissions</h3>
      {submissions.length === 0 ? (
        <p>No submissions yet for this form.</p>
      ) : (
        <div>
          {submissions.map(submission => (
            <div key={submission.id} className="submission-item">
              <p><strong>Submitted At:</strong> {new Date(submission.submitted_at).toLocaleString()}</p>
              <h4>Data:</h4>
              <pre>{JSON.stringify(submission.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubmissionsPage;
