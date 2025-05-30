import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination } from 'react-bootstrap';

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get the token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 3,
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
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      });
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

  const fetchBooksWithRetry = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(
          `https://assignment-3-mxhg.onrender.com/api/books?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Fetch books response:', response.data);

        // Ensure response.data.books is an array
        const fetchedBooks = Array.isArray(response.data.books) ? response.data.books : [];
        fetchedBooks.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace('£', '') || 0);
          const priceB = parseFloat(b.price?.replace('£', '') || 0);
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
        setBooks(fetchedBooks);
        setTotalPages(Number.isInteger(response.data.totalPages) ? response.data.totalPages : 1);
        return;
      } catch (error) {
        console.error(`Fetch attempt ${i + 1} failed:`, error.response?.data || error.message);
        if (i === retries - 1) {
          setError(error.response?.data?.error || error.response?.data?.message || 'Error fetching books. Please try again later.');
        } else {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    await fetchBooksWithRetry();
    setLoading(false);
  };

  const handleScrape = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://assignment-3-mxhg.onrender.com/api/books/scrape',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Scrape response:', response.data);
      setPage(1);
      await fetchBooks();
    } catch (error) {
      console.error('Error scraping books:', error.response?.data || error.message);
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to scrape books');
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all books? This action cannot be undone.')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.delete(
        'https://assignment-3-mxhg.onrender.com/api/books',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Delete response:', response.data);
      setPage(1);
      await fetchBooks();
    } catch (error) {
      console.error('Error deleting books:', error.response?.data || error.message);
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to delete books');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return;
    }
    fetchBooks();
  }, [page, sortOrder, token]);

  // Show a loading spinner while fetching data
  if (loading && !error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <svg
            className="animate-spin h-8 w-8 mx-auto mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        padding: '3rem 1rem',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        id="particles-js"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      ></div>
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '1rem',
            }}
          >
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1e3a8a',
                letterSpacing: '-0.025em',
              }}
            >
              📚 Book Scraper Dashboard
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleScrape}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  color: 'white',
                  background: loading ? '#9ca3af' : '#3b82f6',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.background = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.background = '#3b82f6';
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-2 w-2 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Scraping...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2 w-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Scrape Now
                  </>
                )}
              </button>
              <button
                onClick={handleSortByPrice}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  color: 'white',
                  background: '#10b981',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#10b981';
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                Sort by Price ({sortOrder === 'asc' ? '↑' : '↓'})
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  color: 'white',
                  background: loading ? '#9ca3af' : '#ef4444',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.background = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.background = '#ef4444';
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete All
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#fee2e2',
                color: '#dc2626',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 22"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{error}</p>
            </div>
          )}

          <div style={{ overflowX: 'auto', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <Table
              style={{
                background: 'white',
                color: '#1f2937',
                borderCollapse: 'separate',
                borderSpacing: 0,
              }}
            >
              <thead
                style={{
                  background: '#1e3a8a',
                  color: 'white',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '1rem',
                      borderTopLeftRadius: '0.5rem',
                    }}
                  >
                    Title
                  </th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Price</th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '1rem',
                      borderTopRightRadius: '0.5rem',
                    }}
                  >
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? '#f9fafb' : 'white',
                        transition: 'background 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#f9fafb' : 'white';
                      }}
                    >
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{book.title || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#16a34a' }}>{book.price || 'N/A'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            background: '#fef3c7',
                            color: '#d97706',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 .587l3.668 7.431 8.332 1.209-6.001 5.858 1.416 8.265L12 18.896l-7.415 3.897 1.416-8.265-6.001-5.858 8.332-1.209L12 .587z" />
                          </svg>
                          {book.rating || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        padding: '2rem',
                        fontStyle: 'italic',
                      }}
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem',
            }}
          >
            <Pagination style={{ display: 'flex', gap: '0.5rem' }}>
              <Pagination.Prev
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                style={{
                  background: page === 1 ? '#d1d5db' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.025rem 0.15rem',
                  borderRadius: '0.2rem',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s ease',
                  fontWeight: '500',
                  fontSize: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.05rem',
                }}
                onMouseEnter={(e) => {
                  if (page !== 1) e.target.style.background = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (page !== 1) e.target.style.background = '#3b82f6';
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-0.5 w-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </Pagination.Prev>
              <Pagination.Item
                active
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.025rem 0.15rem',
                  borderRadius: '0.2rem',
                  fontSize: '0.45rem',
                  fontWeight: '600',
                }}
              >
                {page}
              </Pagination.Item>
              <Pagination.Next
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                style={{
                  background: page === totalPages ? '#d1d5db' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.025rem 0.15rem',
                  borderRadius: '0.2rem',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s ease',
                  fontWeight: '500',
                  fontSize: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.05rem',
                }}
                onMouseEnter={(e) => {
                  if (page !== totalPages) e.target.style.background = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (page !== totalPages) e.target.style.background = '#3b82f6';
                }}
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-0.5 w-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;