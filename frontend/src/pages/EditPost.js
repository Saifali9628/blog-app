import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

function EditPost() {
  const { id } = useParams(); // Get the post ID from URL params
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // New image to be uploaded
  const [existingImage, setExistingImage] = useState(''); // To store the existing image URL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the post data when the component is mounted
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setExistingImage(post.image || ''); // If there's an image, store it for displaying
      } catch (err) {
        console.error('Error fetching post:', err);
        alert('Failed to fetch post data');
      }
    };

    fetchPost();
  }, [id]); // Fetch post data only when the ID changes

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

    // If a new image is provided, append it to the FormData
    if (image) {
      formData.append('image', image);
    }

    try {
      setLoading(true); // Start loading
      await API.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add the token to the header
        },
      });

      // Clear input fields after successful post update
      setTitle('');
      setContent('');
      setImage(null);

      // Navigate to home page or another page after successful post update
      navigate('/');
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };
   //  Cancel button ka function
  const handleCancel = () => {
    navigate('/'); // Go to home page
  };

  return (
    <div className="container">
      <h1>Edit Post</h1>
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

        {/* Display the current image if it exists */}
        {existingImage && (
          <div>
            <h3>Current Image:</h3>
            <img src={existingImage} alt="Current Post" className="post-image" />
          </div>
        )}

        {/* Option to upload a new image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="file-input"
        />

        <div className="button-group">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>

          <button type="button" className="btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        {/* <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update'} {/* Display loading text */}
        {/* </button> */} 
      </form>
    </div>
  );
}

export default EditPost;
