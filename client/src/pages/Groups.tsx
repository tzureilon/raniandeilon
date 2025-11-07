import Card from '../components/Card';
import './Groups.css';

const Groups = () => {
  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>👥 ניהול קבוצות</h1>
        <p>קבוצות פייסבוק לפרסום</p>
      </div>

      <Card>
        <div className="coming-soon">
          <h2>🚧 בבנייה</h2>
          <p>ניהול קבוצות פייסבוק יהיה זמין בקרוב</p>
          <p className="hint">בינתיים, ניתן להוסיף קבוצות ישירות ב-PostgreSQL</p>
        </div>
      </Card>
    </div>
  );
};

export default Groups;
