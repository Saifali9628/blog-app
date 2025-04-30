import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the token exists in localStorage before submitting the form
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      setLoading(true); // Start loading
      const res = await API.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      console.log("Resposne data", res.data);

      // Clear input fields after successful post creation
      setTitle('');
      setContent('');
      setImage(null);

      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setLoading(false); // Stop loading once request is complete
    }
  };

  return (
    <div className="container">
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit} className="form">
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          required
          rows="6"
          className="textarea"
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])}
          className="file-input"
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create'} {/* Display loading text */}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
