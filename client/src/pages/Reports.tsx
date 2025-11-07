import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { GroupPerformance, PropertyPerformance } from '../types';
import Card from '../components/Card';
import './Reports.css';

const Reports = () => {
  const [groupPerformance, setGroupPerformance] = useState<GroupPerformance[]>([]);
  const [propertyPerformance, setPropertyPerformance] = useState<PropertyPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsRes, propertiesRes] = await Promise.all([
        dashboardService.getGroupPerformance(),
        dashboardService.getPropertyPerformance(),
      ]);

      setGroupPerformance(groupsRes.data.data);
      setPropertyPerformance(propertiesRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען דוחות...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>📈 דוחות וביצועים</h1>
        <p>ניתוח מעמיק של הביצועים</p>
      </div>

      <Card title="🏆 ביצועי קבוצות מובילות">
        {groupPerformance.length === 0 ? (
          <p className="no-data">אין נתונים להצגה</p>
        ) : (
          <div className="table-wrapper">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>שם קבוצה</th>
                  <th>חברים</th>
                  <th>פוסטים</th>
                  <th>לייקים</th>
                  <th>תגובות</th>
                  <th>לידים</th>
                </tr>
              </thead>
              <tbody>
                {groupPerformance.slice(0, 10).map((group) => (
                  <tr key={group.id}>
                    <td><strong>{group.name}</strong></td>
                    <td>{group.members_count?.toLocaleString('he-IL')}</td>
                    <td>{group.total_posts}</td>
                    <td>{group.total_likes}</td>
                    <td>{group.total_comments}</td>
                    <td><strong className="highlight">{group.total_leads}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="🏠 ביצועי נכסים מובילים">
        {propertyPerformance.length === 0 ? (
          <p className="no-data">אין נתונים להצגה</p>
        ) : (
          <div className="table-wrapper">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>נכס</th>
                  <th>מחיר</th>
                  <th>פוסטים</th>
                  <th>צפיות</th>
                  <th>לייקים</th>
                  <th>לידים</th>
                  <th>🔥 חמים</th>
                </tr>
              </thead>
              <tbody>
                {propertyPerformance.slice(0, 10).map((prop) => (
                  <tr key={prop.id}>
                    <td>
                      <strong>{prop.property_type}</strong> • {prop.city}
                      {prop.neighborhood && `, ${prop.neighborhood}`}
                    </td>
                    <td>{prop.price?.toLocaleString('he-IL')} ₪</td>
                    <td>{prop.total_posts}</td>
                    <td>{prop.total_views}</td>
                    <td>{prop.total_likes}</td>
                    <td><strong>{prop.total_leads}</strong></td>
                    <td><strong className="hot">{prop.hot_leads}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
