import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

export default function FoundDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/items?type=found')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Found Items</h2>
        <Link to="/post-found">
          <button style={styles.button}>Report Found Item</button>
        </Link>
      </div>
      <div style={styles.itemsGrid}>
        {items.map(item => (
          <div key={item._id} style={styles.card}>
            {item.photoUrl && (
              <img src={item.photoUrl} alt={item.title} style={styles.image} />
            )}
            <h4 style={styles.title}>{item.title}</h4>
            <p style={styles.description}>{item.description}</p>
            <div style={styles.details}>
              <p>Location: {item.location}</p>
              <p>Found on: {new Date(item.date).toLocaleDateString()}</p>
            </div>
            <div style={styles.cardFooter}>
              <Link to={`/item/${item._id}`}>
                <button style={styles.viewButton}>View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '1.2em',
  },
  description: {
    margin: '0 0 10px 0',
    color: '#666',
  },
  details: {
    fontSize: '0.9em',
    color: '#666',
  },
  cardFooter: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  viewButton: {
    backgroundColor: '#34A853',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
