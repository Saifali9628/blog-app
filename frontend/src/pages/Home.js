import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user info from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      navigate('/login'); // If no user, redirect to login
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts');
        console.log("response url", res.data);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="outer-container">
      <div className="header">
  {user && (
    <div className="user-info"> 
      <img
        src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`}
        alt={user.username}
        className="profile-pic"
      />
      <span className="username">{user.username}</span>
      <button onClick={handleLogout} className="btn-logout">Logout</button>
    </div>
  )}
</div>


      <h1>All Posts</h1>
      <Link to="/create">
        <button className="btn-create">Create New Post</button>
      </Link>

      <div className="posts-wrapper">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            {post.image && (
              <img
                src={post.image.startsWith('http') ? post.image : `http://localhost:5000/${post.image}`}
                alt={post.title}
                className="post-image"
              />
            )}
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><b>Author:</b> {post.author?.username}</p>
            <div className="post-actions">
              <Link to={`/edit/${post._id}`}>
                <button className="btn-edit">Edit</button>
              </Link>
              <button onClick={() => handleDelete(post._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
