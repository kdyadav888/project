import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    pendingClaims: 0
  });
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/items?type=lost'),
      axios.get('/api/items?type=found'),
      axios.get('/api/claims')
    ])
      .then(([lostRes, foundRes, claimsRes]) => {
        setStats({
          totalLost: lostRes.data.length,
          totalFound: foundRes.data.length,
          pendingClaims: claimsRes.data.filter(c => c.status === 'pending').length
        });
        setClaims(claimsRes.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleClaimAction = async (claimId, action) => {
    try {
      await axios.put(`/api/claims/${claimId}/${action}`);
      // Refresh claims
      const { data } = await axios.get('/api/claims');
      setClaims(data);
    } catch (error) {
      console.error('Error updating claim:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Lost Items</h3>
          <p>{stats.totalLost}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Found Items</h3>
          <p>{stats.totalFound}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Pending Claims</h3>
          <p>{stats.pendingClaims}</p>
        </div>
      </div>

      <h2>Recent Claims</h2>
      <div style={styles.claimsContainer}>
        {claims.map(claim => (
          <div key={claim._id} style={styles.claimCard}>
            <div style={styles.claimInfo}>
              <h4>Item: {claim.itemId.title}</h4>
              <p>Claimed by: {claim.claimantId.email}</p>
              <p>Status: {claim.status}</p>
              <p>Message: {claim.message}</p>
            </div>
            {claim.status === 'pending' && (
              <div style={styles.claimActions}>
                <button 
                  onClick={() => handleClaimAction(claim._id, 'approve')}
                  style={{...styles.button, backgroundColor: '#34A853'}}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleClaimAction(claim._id, 'reject')}
                  style={{...styles.button, backgroundColor: '#EA4335'}}
                >
                  Reject
                </button>
              </div>
            )}
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  claimsContainer: {
    display: 'grid',
    gap: '20px',
  },
  claimCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  claimInfo: {
    flex: 1,
  },
  claimActions: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
