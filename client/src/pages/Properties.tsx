import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesService } from '../services/api';
import { Property } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertiesService.getAll();
      setProperties(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק נכס זה?')) return;

    try {
      await propertiesService.delete(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('שגיאה במחיקת הנכס');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await propertiesService.updateStatus(id, status);
      setProperties(
        properties.map((p) => (p.id === id ? { ...p, status: status as any } : p))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const filteredProperties = properties.filter((p) =>
    filter === 'all' ? true : p.status === filter
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>טוען נכסים...</p>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <div className="page-header">
        <div>
          <h1>🏠 ניהול נכסים</h1>
          <p>סה"כ {properties.length} נכסים במערכת</p>
        </div>
        <Button onClick={() => navigate('/properties/add')}>
          ➕ הוסף נכס חדש
        </Button>
      </div>

      <div className="filters">
        <button
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          הכל ({properties.length})
        </button>
        <button
          className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('active')}
        >
          פעילים ({properties.filter((p) => p.status === 'active').length})
        </button>
        <button
          className={filter === 'sold' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('sold')}
        >
          נמכרו ({properties.filter((p) => p.status === 'sold').length})
        </button>
        <button
          className={filter === 'rented' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('rented')}
        >
          הושכרו ({properties.filter((p) => p.status === 'rented').length})
        </button>
      </div>

      {filteredProperties.length === 0 ? (
        <Card>
          <div className="empty-state">
            <h3>אין נכסים להצגה</h3>
            <p>התחל על ידי הוספת נכס ראשון</p>
            <Button onClick={() => navigate('/properties/add')}>
              ➕ הוסף נכס
            </Button>
          </div>
        </Card>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="property-card">
              <div className="property-header">
                <span className={`property-status status-${property.status}`}>
                  {property.status === 'active' && '✅ פעיל'}
                  {property.status === 'sold' && '🔒 נמכר'}
                  {property.status === 'rented' && '🏷️ הושכר'}
                  {property.status === 'inactive' && '⏸️ לא פעיל'}
                </span>
                <span className="property-type">{property.property_type}</span>
              </div>

              <h3 className="property-title">
                {property.city}
                {property.neighborhood && `, ${property.neighborhood}`}
              </h3>

              <div className="property-details">
                <div className="detail-item">
                  <span className="detail-label">מחיר:</span>
                  <span className="detail-value">
                    {property.price.toLocaleString('he-IL')} ₪
                  </span>
                </div>

                {property.rooms && (
                  <div className="detail-item">
                    <span className="detail-label">חדרים:</span>
                    <span className="detail-value">{property.rooms}</span>
                  </div>
                )}

                {property.area_sqm && (
                  <div className="detail-item">
                    <span className="detail-label">שטח:</span>
                    <span className="detail-value">{property.area_sqm} מ"ר</span>
                  </div>
                )}
              </div>

              {property.description && (
                <p className="property-description">{property.description}</p>
              )}

              <div className="property-actions">
                <select
                  value={property.status}
                  onChange={(e) => handleStatusChange(property.id!, e.target.value)}
                  className="status-select"
                >
                  <option value="active">פעיל</option>
                  <option value="sold">נמכר</option>
                  <option value="rented">הושכר</option>
                  <option value="inactive">לא פעיל</option>
                </select>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => navigate(`/properties/edit/${property.id}`)}
                >
                  ✏️ ערוך
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => handleDelete(property.id!)}
                >
                  🗑️ מחק
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
