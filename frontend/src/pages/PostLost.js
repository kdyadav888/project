import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function PostLost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    claimQuestion: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        type: 'lost'
      };
      
      await axios.post('/api/items', payload);
      navigate('/dashboard/lost');
    } catch (error) {
      console.error('Error posting lost item:', error);
      alert('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2>Report Lost Item</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What did you lose?"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="documents">Documents</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item (color, brand, condition, etc.)"
              style={{ ...styles.input, minHeight: '100px' }}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Date Lost</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Where did you last see it?"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Claim Question</label>
            <input
              name="claimQuestion"
              value={form.claimQuestion}
              onChange={handleChange}
              placeholder="Question to verify the true owner"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Tags</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Add tags separated by commas"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Posting...' : 'Post Lost Item'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  formCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  }
};

