import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { DashboardStats, Lead } from '../types';
import Card from '../components/Card';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes, recsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getHotLeads(10),
        dashboardService.getRecommendations(),
      ]);

      setStats(statsRes.data.data);
      setHotLeads(leadsRes.data.data);
      setRecommendations(recsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>📊 דשבורד</h1>
        <p>סקירה כללית של המערכת</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-info">
              <h3>{stats.total_properties}</h3>
              <p>סה"כ נכסים</p>
              <span className="stat-detail">פעילים: {stats.active_properties}</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon">📢</div>
            <div className="stat-info">
              <h3>{stats.total_posts_today}</h3>
              <p>פוסטים היום</p>
              <span className="stat-detail">ממתינים: {stats.pending_posts}</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{stats.total_leads_today}</h3>
              <p>לידים היום</p>
              <span className="stat-detail hot">🔥 חמים: {stats.hot_leads_today}</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.active_groups}</h3>
              <p>קבוצות פעילות</p>
              <span className="stat-detail">פייסבוק</span>
            </div>
          </Card>
        </div>
      )}

      {recommendations.length > 0 && (
        <Card title="💡 המלצות לשיפור" className="recommendations-card">
          <ul className="recommendations-list">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="🔥 לידים חמים אחרונים">
        {hotLeads.length === 0 ? (
          <p className="no-data">אין לידים חמים כרגע</p>
        ) : (
          <div className="leads-list">
            {hotLeads.map((lead) => (
              <div key={lead.id} className="lead-item">
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
                    {lead.created_at && new Date(lead.created_at).toLocaleString('he-IL')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
