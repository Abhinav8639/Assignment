import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Loading particles.js...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      console.log('particles.js loaded successfully');
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#00FF7F' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#00FF7F',
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { particles_nb: 4 },
            },
          },
          retina_detect: true,
        });
      }
    };
    script.onerror = () => {
      console.error('Failed to load particles.js');
    };
    document.body.appendChild(script);

    return () => {
      const addedScript = document.querySelector(`script[src="${script.src}"]`);
      if (addedScript) {
        document.body.removeChild(addedScript);
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://assignment-3-mxhg.onrender.com/api/auth/login', {
        username,
        password,
      });
      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error, please check the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 1rem', position: 'relative' }}>
      <div id="particles-js" />
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'black', opacity: 0.2 }}></div>
      <div style={{ margin: '0 auto', maxWidth: '400px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: '#1F2937', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ marginTop: '1rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
              Book Scraper Admin
            </h2>
            <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
              Access the book scraper dashboard
            </p>
          </div>
          {error && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(127, 29, 29, 0.5)', color: '#FECACA', borderRadius: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>⚠️</span>
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="username" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  background: '#374151',
                  border: '1px solid #4B5563',
                  color: '#D1D5DB',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="password" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  background: '#374151',
                  border: '1px solid #4B5563',
                  color: '#D1D5DB',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'black',
                background: '#00FF7F',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;