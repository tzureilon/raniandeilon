import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertiesService } from '../services/api';
import { Property } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import './PropertyForm.css';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Property>>({
    property_type: 'דירה',
    city: '',
    neighborhood: '',
    street: '',
    price: 0,
    rooms: 0,
    area_sqm: 0,
    description: '',
    status: 'active',
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertiesService.getById(parseInt(id!));
      setFormData(response.data.data);
      // TODO: Load images
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('שגיאה בטעינת הנכס');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'rooms' || name === 'area_sqm' ? parseFloat(value) || 0 : value,
    });
  };

  const handleAddImage = () => {
    const url = prompt('הכנס כתובת URL של התמונה:');
    if (url) {
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        property: formData,
        images: images,
      };

      if (isEdit) {
        await propertiesService.update(parseInt(id!), formData);
        alert('הנכס עודכן בהצלחה!');
      } else {
        await propertiesService.create(payload);
        alert('הנכס נוסף בהצלחה!');
      }

      navigate('/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      alert('שגיאה בשמירת הנכס');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-page">
      <div className="page-header">
        <h1>{isEdit ? '✏️ עריכת נכס' : '➕ הוספת נכס חדש'}</h1>
        <Button variant="secondary" onClick={() => navigate('/properties')}>
          ← חזרה לרשימה
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="פרטי הנכס">
          <div className="form-grid">
            <div className="form-group">
              <label>סוג נכס *</label>
              <select name="property_type" value={formData.property_type} onChange={handleChange} required>
                <option value="דירה">דירה</option>
                <option value="בית פרטי">בית פרטי</option>
                <option value="מגרש">מגרש</option>
                <option value="נכס מסחרי">נכס מסחרי</option>
              </select>
            </div>

            <div className="form-group">
              <label>עיר *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="לדוגמה: תל אביב"
              />
            </div>

            <div className="form-group">
              <label>שכונה</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="לדוגמה: צפון הישן"
              />
            </div>

            <div className="form-group">
              <label>רחוב</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="לדוגמה: דיזנגוף"
              />
            </div>

            <div className="form-group">
              <label>מחיר *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="לדוגמה: 2500000"
              />
            </div>

            <div className="form-group">
              <label>מספר חדרים</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                placeholder="לדוגמה: 4"
              />
            </div>

            <div className="form-group">
              <label>שטח (מ"ר)</label>
              <input
                type="number"
                name="area_sqm"
                value={formData.area_sqm}
                onChange={handleChange}
                placeholder="לדוגמה: 100"
              />
            </div>

            <div className="form-group">
              <label>סטטוס</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">פעיל</option>
                <option value="sold">נמכר</option>
                <option value="rented">הושכר</option>
                <option value="inactive">לא פעיל</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>תיאור</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="תאר את הנכס בפירוט..."
            />
          </div>
        </Card>

        <Card title="תמונות">
          <div className="images-section">
            {images.length > 0 && (
              <div className="images-grid">
                {images.map((img, index) => (
                  <div key={index} className="image-item">
                    <img src={img} alt={`תמונה ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button type="button" variant="secondary" onClick={handleAddImage}>
              📷 הוסף תמונה
            </Button>
          </div>
        </Card>

        <div className="form-actions">
          <Button type="submit" disabled={loading} size="large">
            {loading ? 'שומר...' : isEdit ? '💾 שמור שינויים' : '➕ הוסף נכס'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={() => navigate('/properties')}
          >
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
