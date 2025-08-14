import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    subscribe: false,
    comment: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://13.53.214.180:3000/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const { name, email, password, gender } = form;
    if (!name || !email || !password || !gender) {
      setMessage('Please fill all required fields');
      return;
    }
    try {
      const res = await fetch('http://13.53.214.180:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage('Error: ' + (err.error || 'Unknown error'));
        return;
      }
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setForm({
        name: '',
        email: '',
        password: '',
        gender: '',
        subscribe: false,
        comment: '',
      });
      setMessage('User added successfully!');
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Users</h1>

      <div className="app-layout">
        {/* Left Panel - Form */}
        <div className="left-panel">
          <form onSubmit={handleSubmit} className="user-form">
            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="gender-group">
              Gender *:{' '}
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.gender === 'male'}
                  onChange={handleChange}
                />{' '}
                Male
              </label>{' '}
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.gender === 'female'}
                  onChange={handleChange}
                />{' '}
                Female
              </label>{' '}
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={form.gender === 'other'}
                  onChange={handleChange}
                />{' '}
                Other
              </label>
            </div>

            <label className="subscribe-label">
              <input
                type="checkbox"
                name="subscribe"
                checked={form.subscribe}
                onChange={handleChange}
              />
              Subscribe to newsletter
            </label>

            <textarea
              name="comment"
              placeholder="Comment"
              value={form.comment}
              onChange={handleChange}
              rows={3}
            />

            <button type="submit">Add User</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>

        {/* Right Panel - Table */}
        <div className="right-panel">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Subscribed</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.subscribe ? 'Yes' : 'No'}</td>
                  <td>{user.comment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
