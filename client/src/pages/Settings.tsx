import Card from '../components/Card';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>⚙️ הגדרות</h1>
        <p>הגדרות מערכת וניהול</p>
      </div>

      <Card>
        <div className="coming-soon">
          <h2>🚧 בבנייה</h2>
          <p>הגדרות המערכת יהיו זמינות בקרוב</p>
          <p className="hint">בינתיים, ניתן לשנות הגדרות בקובץ .env</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
