import React, { useState, useEffect } from 'react';

function AllSubmissionsDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('submitted_at');
  const [orderBy, setOrderBy] = useState('desc'); // Default descending

  useEffect(() => {
    fetchAllSubmissions();
  }, [sortBy, orderBy]);

  const fetchAllSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/submissions/all?sort_by=${sortBy}&order=${orderBy}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    setOrderBy(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) return <div className="container">Loading all submissions...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h2>All Feedback Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions found across all forms.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Form Title</th>
              <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                Submitted At {orderBy === 'asc' ? '▲' : '▼'}
              </th>
              <th>Submission Data</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id}>
                <td>{submission.form_title}</td>
                <td>{new Date(submission.submitted_at).toLocaleString()}</td>
                <td>
                  <pre>{JSON.stringify(submission.data, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllSubmissionsDashboard;
