import { useState, useEffect } from 'react';
import { leadsService } from '../services/api';
import { Lead } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import './Leads.css';

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      const response = await leadsService.getAll(filter === 'all' ? undefined : filter);
      setLeads(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await leadsService.updateStatus(id, status);
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: status as any } : l)));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'hot':
        return '#ff6b6b';
      case 'warm':
        return '#ffa94d';
      case 'cold':
        return '#74c0fc';
      default:
        return '#adb5bd';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען לידים...</p>
      </div>
    );
  }

  return (
    <div className="leads-page">
      <div className="page-header">
        <div>
          <h1>🎯 ניהול לידים</h1>
          <p>סה"כ {leads.length} לידים במערכת</p>
        </div>
      </div>

      <div className="filters">
        <button
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          הכל
        </button>
        <button
          className={filter === 'new' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('new')}
        >
          חדשים
        </button>
        <button
          className={filter === 'contacted' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('contacted')}
        >
          טופלו
        </button>
        <button
          className={filter === 'qualified' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('qualified')}
        >
          מוסמכים
        </button>
        <button
          className={filter === 'converted' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('converted')}
        >
          הומרו
        </button>
      </div>

      {leads.length === 0 ? (
        <Card>
          <div className="empty-state">
            <h3>אין לידים להצגה</h3>
            <p>לידים יופיעו כאן כאשר אנשים מגיבים לפוסטים</p>
          </div>
        </Card>
      ) : (
        <div className="leads-list">
          {leads.map((lead) => (
            <Card key={lead.id} className="lead-card">
              <div className="lead-card-header">
                <div>
                  <h3>{lead.fb_user_name || 'לא ידוע'}</h3>
                  {lead.fb_profile_url && (
                    <a href={lead.fb_profile_url} target="_blank" rel="noopener noreferrer">
                      פרופיל פייסבוק →
                    </a>
                  )}
                </div>
                <div className="lead-badges">
                  <span
                    className="sentiment-badge"
                    style={{ backgroundColor: getSentimentColor(lead.sentiment) }}
                  >
                    {lead.score}/100
                  </span>
                </div>
              </div>

              <div className="lead-message">
                <strong>הודעה:</strong>
                <p>{lead.message_text}</p>
              </div>

              {lead.property_type && (
                <div className="lead-property">
                  <span>🏠 {lead.property_type}</span>
                  {lead.city && <span> • 📍 {lead.city}</span>}
                  {lead.price && <span> • 💰 {lead.price.toLocaleString('he-IL')} ₪</span>}
                </div>
              )}

              <div className="lead-footer">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">חדש</option>
                  <option value="contacted">טופל</option>
                  <option value="qualified">מוסמך</option>
                  <option value="converted">הומר</option>
                  <option value="lost">אבד</option>
                </select>
                <span className="lead-time">
                  {lead.created_at && new Date(lead.created_at).toLocaleString('he-IL')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leads;
