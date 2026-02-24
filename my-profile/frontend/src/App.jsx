import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('guestbook')
        .insert([{ name: form.name, message: form.message }]);
      
      if (error) throw error;

      setForm({ name: '', message: '' });
      await fetchEntries();
      // Optional: Add a toast notification here instead of alert
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="hero">
        <h1>Digital Guestbook</h1>
        <p>Leave a note, a kind word, or just say hello!</p>
      </header>

      <main>
        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="How should we call you?"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Write your message here..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing...' : 'Sign the Guestbook'}
            </button>
          </form>
        </div>

        <section className="feed">
          <h2 className="entries-title">
            Recent Messages <span>{entries.length}</span>
          </h2>
          
          <div className="entries">
            {entries.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>No messages yet. Be the first!</p>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <span className="entry-name">{entry.name}</span>
                    <span className="entry-date">
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="entry-message">{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        Built with React & Supabase
      </footer>
    </div>
  );
}

export default App;