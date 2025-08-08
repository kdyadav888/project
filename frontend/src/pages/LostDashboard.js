import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

const LostDashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/items?type=lost')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Lost Items</h2>
        <Link to="/post-lost">
          <button style={styles.button}>Post Lost Item</button>
        </Link>
      </div>
      <div style={styles.itemsGrid}>
        {items.map(item => (
          <div key={item._id} style={styles.card}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
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
};

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

export default LostDashboard;
