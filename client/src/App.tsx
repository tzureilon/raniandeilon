import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface DashboardStats {
  total_properties: number;
  active_properties: number;
  total_posts_today: number;
  total_leads_today: number;
  hot_leads_today: number;
  pending_posts: number;
  active_groups: number;
}

interface Lead {
  id: number;
  fb_user_name: string;
  message_text: string;
  sentiment: string;
  score: number;
  city?: string;
  property_type?: string;
  created_at: string;
}

function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboard/stats`),
        axios.get(`${API_BASE}/dashboard/hot-leads?limit=10`),
      ]);

      setStats(statsRes.data.data);
      setHotLeads(leadsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Propel.AI</h1>
        <p>מערכת אוטונומית לשיווק נדל״ן בפייסבוק</p>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>🏠 נכסים</h3>
            <div className="stat-value">{stats.total_properties}</div>
            <div className="stat-label">פעילים: {stats.active_properties}</div>
          </div>

          <div className="stat-card">
            <h3>📢 פוסטים היום</h3>
            <div className="stat-value">{stats.total_posts_today}</div>
            <div className="stat-label">ממתינים: {stats.pending_posts}</div>
          </div>

          <div className="stat-card">
            <h3>🎯 לידים היום</h3>
            <div className="stat-value">{stats.total_leads_today}</div>
            <div className="stat-label hot">🔥 חמים: {stats.hot_leads_today}</div>
          </div>

          <div className="stat-card">
            <h3>👥 קבוצות</h3>
            <div className="stat-value">{stats.active_groups}</div>
            <div className="stat-label">פעילות</div>
          </div>
        </div>
      )}

      <div className="leads-section">
        <h2>🔥 לידים חמים</h2>
        {hotLeads.length === 0 ? (
          <p className="no-data">אין לידים חמים כרגע</p>
        ) : (
          <div className="leads-list">
            {hotLeads.map((lead) => (
              <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <span className="lead-name">{lead.fb_user_name || 'לא ידוע'}</span>
                  <span className={`lead-score score-${lead.sentiment}`}>
                    {lead.score}/100
                  </span>
                </div>
                <div className="lead-message">{lead.message_text}</div>
                <div className="lead-footer">
                  <span>
                    {lead.property_type && `${lead.property_type} • `}
                    {lead.city || 'לא ידוע'}
                  </span>
                  <span className="lead-time">
                    {new Date(lead.created_at).toLocaleString('he-IL')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Propel.AI &copy; 2024 - מערכת שיווק נדל״ן אוטונומית</p>
      </footer>
    </div>
  );
}

export default App;
