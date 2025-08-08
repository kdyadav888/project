import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimForm, setClaimForm] = useState({ message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`/api/items/${id}`)
      .then(res => setItem(res.data))
      .catch(err => {
        console.error('Error fetching item:', err);
        alert('Failed to load item details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/claims', {
        itemId: id,
        message: claimForm.message
      });
      alert('Claim submitted successfully!');
      navigate('/dashboard/' + item.type);
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!item) return <div style={styles.container}>Item not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{item.title}</h2>
        
        {item.photoUrl && (
          <img src={item.photoUrl} alt={item.title} style={styles.image} />
        )}

        <div style={styles.details}>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {item.description}</p>
          
          {item.tags && item.tags.length > 0 && (
            <div style={styles.tags}>
              {item.tags.map(tag => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {item.type === 'lost' && item.status === 'active' && (
          <div style={styles.claimSection}>
            <h3>Found this item?</h3>
            <form onSubmit={handleSubmitClaim} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Message to the owner:</label>
                <textarea
                  value={claimForm.message}
                  onChange={e => setClaimForm({ ...claimForm, message: e.target.value })}
                  placeholder="Describe where and when you found it..."
                  style={styles.textarea}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={styles.button}
              >
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </form>
          </div>
        )}
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
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
  },
  image: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  details: {
    marginBottom: '20px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  tag: {
    background: '#e1e1e1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
  },
  claimSection: {
    marginTop: '20px',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  textarea: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minHeight: '100px',
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
