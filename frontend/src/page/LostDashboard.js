import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LostDashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/items?type=lost')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Lost Items</h2>
      {items.map(item => (
        <div key={item._id}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          {/* Link to claim, view details, etc. */}
        </div>
      ))}
    </div>
  );
};

// src/pages/LostDashboard.js
export default function LostDashboard() {
  return <div>LostDashboard Page</div>;
}
