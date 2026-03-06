import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FormBuilder() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]); // [{ id: 1, type: 'text', label: 'Your Name' }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (formId) {
      setIsEditing(true);
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setFields(JSON.parse(data.fields)); // Parse the JSON string back to an object
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { id: fields.length + 1, type: 'text', label: 'New Field' }]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formMethod = isEditing ? 'PUT' : 'POST';
    const formUrl = isEditing ? `/api/forms/${formId}` : '/api/forms';

    try {
      const response = await fetch(formUrl, {
        method: formMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          fields, // This will be stringified by JSON.stringify
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      navigate('/admin'); // Redirect to admin dashboard after save
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="container">Loading form...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h2>{isEditing ? 'Edit Form' : 'Create New Form'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Form Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <h3>Form Fields</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="form-field">
            <label>Field {index + 1}:</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(index, 'label', e.target.value)}
              placeholder="Field Label"
              required
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, 'type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
            </select>
            <button type="button" onClick={() => removeField(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addField}>Add Field</button>

        <button type="submit" disabled={loading}>
          {isEditing ? 'Update Form' : 'Create Form'}
        </button>
      </form>
    </div>
  );
}

export default FormBuilder;
