import React, { useState } from 'react';
import axios from 'axios';

const PostLost = () => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    claimQuestion: '',
    tags: '' // comma-separated string for input
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      type: 'lost'
    };
    axios.post('/api/items', payload)
      .then(() => {
        alert('Posted!');
        setForm({ title: '', category: '', description: '', date: '', location: '', claimQuestion: '', tags: '' });
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="date" type="date" value={form.date} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <input name="claimQuestion" placeholder="Claim Question" value={form.claimQuestion} onChange={handleChange} />
      <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
      <button type="submit">Post Lost Item</button>
    </form>
  );
};

export default PostLost;
