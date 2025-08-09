import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/common';
import { colors, spacing, typography, transitions } from '../styles/theme';

export default function PostFound() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    tags: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setForm({ ...form, photoUrl: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!form.category) {
      setError('Please select a category');
      return false;
    }
    if (!form.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!form.date) {
      setError('Date is required');
      return false;
    }
    if (!form.location.trim()) {
      setError('Location is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'tags') {
          const tagsArray = form[key].split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
          formData.append('tags', JSON.stringify(tagsArray));
        } else if (key === 'photoUrl' && form[key]) {
          formData.append('photo', form[key]);
        } else {
          formData.append(key, form[key].trim());
        }
      });
      formData.append('type', 'found');
      
      await axios.post('/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard/found');
    } catch (error) {
      console.error('Error posting found item:', error);
      setError('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Report Found Item</h1>
          <p style={styles.headerSubtitle}>Help others find their lost belongings by reporting what you've found</p>
        </div>
      
        <Card style={styles.formCard}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={styles.loadingText}>Submitting your report...</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <i className="fas fa-info-circle" style={styles.sectionIcon}></i>
              Basic Information
            </h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What did you find?"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={styles.select}
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
                <label style={styles.label}>Date Found</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Where did you find it?"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <i className="fas fa-list-alt" style={styles.sectionIcon}></i>
              Additional Details
            </h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
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
              <label style={styles.label}>Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Add relevant tags separated by commas (e.g., blue, leather, nike)"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Photo</label>
              <div style={styles.fileUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  Choose Photo
                </Button>
                <span style={styles.fileHint}>Max size: 5MB</span>
              </div>
              {preview && (
                <div style={styles.imagePreview}>
                  <img src={preview} alt="Preview" style={styles.previewImage} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => {
                      setPreview(null);
                      setForm({ ...form, photoUrl: '' });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div style={styles.formActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/dashboard/found')}
              style={styles.cancelButton}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={styles.submitButton}
            >
              <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
              Submit Report
            </Button>
          </div>
          </form>
        )}
      </Card>
      </div>
    </div>
  );
}

// Keyframe animation for the background effect
const keyframes = {
  '@keyframes pulse': {
    '0%': {
      opacity: 0.5,
      transform: 'scale(1)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1.2)',
    },
  },
};

const styles = {
  ...keyframes,
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.15) 0%, rgba(46, 204, 113, 0.12) 50%, rgba(52, 152, 219, 0.15) 100%)',
    padding: `${spacing.xl} 0`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: 'radial-gradient(circle at top right, rgba(52, 152, 219, 0.2) 0%, transparent 70%)',
      pointerEvents: 'none',
      animation: 'pulse 8s infinite alternate',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: 'radial-gradient(circle at bottom left, rgba(46, 204, 113, 0.2) 0%, transparent 70%)',
      pointerEvents: 'none',
      animation: 'pulse 8s infinite alternate-reverse',
    },
  },
  container: {
    padding: spacing.xl,
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    background: 'linear-gradient(to bottom, rgba(52, 152, 219, 0.05), rgba(46, 204, 113, 0.05))',
    minHeight: '100vh',
  },
  header: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  headerTitle: {
    ...typography.h1,
    color: 'rgb(52, 152, 219)',
    marginBottom: spacing.xs,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    color: colors.gray[600],
    maxWidth: '600px',
    margin: '0 auto',
  },
  formCard: {
    padding: spacing.xl,
    background: colors.white,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    borderRadius: '16px',
    animation: 'slideUp 0.5s ease-out',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: 'rgba(52, 152, 219, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(46, 204, 113, 0.3)',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: 'rgb(52, 152, 219)',
    marginBottom: spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    '&::before': {
      content: '""',
      width: '4px',
      height: '24px',
      backgroundColor: 'rgb(46, 204, 113)',
      borderRadius: '2px',
    },
  },
  sectionIcon: {
    marginRight: spacing.sm,
    color: 'rgb(46, 204, 113)',
    fontSize: '1.2rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(52, 152, 219, 0.1)',
    borderTop: '3px solid rgb(52, 152, 219)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.gray[600],
    fontSize: typography.body2.fontSize,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.lg,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  label: {
    color: colors.gray[700],
    fontSize: typography.body2.fontSize,
    fontWeight: '500',
  },
  input: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: '12px',
    border: `2px solid ${colors.gray[200]}`,
    fontSize: typography.body1.fontSize,
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: colors.gray[50],
    '&:focus': {
      borderColor: 'rgb(52, 152, 219)',
      boxShadow: '0 0 0 4px rgba(52, 152, 219, 0.1)',
      backgroundColor: colors.white,
    },
    '&:hover': {
      borderColor: 'rgb(46, 204, 113)',
      backgroundColor: colors.white,
    },
  },
  select: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    border: '2px solid rgba(52, 152, 219, 0.2)',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
      borderColor: 'rgb(46, 204, 113)',
      boxShadow: '0 0 0 3px rgba(46, 204, 113, 0.1)',
    },
  },
  fileUpload: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  fileInput: {
    display: 'none',
  },
  fileHint: {
    color: colors.gray[500],
    fontSize: typography.body2.fontSize,
  },
  imagePreview: {
    marginTop: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  previewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: `2px solid ${colors.gray[200]}`,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTop: '1px solid rgba(52, 152, 219, 0.1)',
  },
  cancelButton: {
    color: colors.gray[600],
    padding: `${spacing.sm} ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: colors.gray[800],
      background: 'rgba(52, 152, 219, 0.05)',
      transform: 'translateX(-2px)',
    },
  },
  submitButton: {
    background: 'linear-gradient(45deg, rgb(52, 152, 219), rgb(46, 204, 113))',
    color: 'white',
    padding: `${spacing.sm} ${spacing.xl}`,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  error: {
    padding: spacing.md,
    background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid rgba(231, 76, 60, 0.2)',
    borderRadius: '8px',
    color: 'rgb(231, 76, 60)',
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(52, 152, 219, 0.1)',
    borderTop: '3px solid rgb(46, 204, 113)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: colors.gray[600],
    fontSize: '1.1rem',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};
