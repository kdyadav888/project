import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Don't show nav on login page or if user is not logged in
  if (!user || location.pathname === '/login') return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Lost & Found
        </Link>
        
        <div style={styles.links}>
          <Link 
            to="/dashboard/lost" 
            style={location.pathname === '/dashboard/lost' ? {...styles.link, ...styles.active} : styles.link}
          >
            Lost Items
          </Link>
          <Link 
            to="/dashboard/found"
            style={location.pathname === '/dashboard/found' ? {...styles.link, ...styles.active} : styles.link}
          >
            Found Items
          </Link>
          <Link 
            to="/post-lost"
            style={location.pathname === '/post-lost' ? {...styles.link, ...styles.active} : styles.link}
          >
            Report Lost
          </Link>
          <Link 
            to="/post-found"
            style={location.pathname === '/post-found' ? {...styles.link, ...styles.active} : styles.link}
          >
            Report Found
          </Link>
          {user.role === 'admin' && (
            <Link 
              to="/admin"
              style={location.pathname === '/admin' ? {...styles.link, ...styles.active} : styles.link}
            >
              Admin
            </Link>
          )}
        </div>

        <div style={styles.profile}>
          <img src={user.photo} alt={user.name} style={styles.avatar} />
          <span style={styles.userName}>{user.name}</span>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4285F4',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: '#666',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  active: {
    backgroundColor: '#4285F4',
    color: '#fff',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    color: '#666',
  }
};
