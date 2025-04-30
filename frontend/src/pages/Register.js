import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      await API.post('/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.log(err);
      alert('Registration failed');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="input"
        />
        <button type="submit" className="btn">Register</button>
      </form>
      <p className="link-text">
        Already have an account? <Link to="/login" className="link">Login</Link>
      </p>
    </div>
  );
}

export default Register;
