import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', { email, password });
      console.log("Login ", res.data);
      localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Login failed');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setemail(e.target.value)}
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
        <button type="submit" className="btn">Login</button>
      </form>
      <p className="link-text">
        Don't have an account? <Link to="/register" className="link">Register</Link>
      </p>
    </div>
  );
}

export default Login;
