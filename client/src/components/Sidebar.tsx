import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🚀 Propel.AI</h2>
        <p>שיווק נדל"ן אוטומטי</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="icon">📊</span>
          <span>דשבורד</span>
        </NavLink>

        <NavLink to="/properties" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="icon">🏠</span>
          <span>נכסים</span>
        </NavLink>

        <NavLink to="/leads" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="icon">🎯</span>
          <span>לידים</span>
        </NavLink>

        <NavLink to="/groups" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="icon">👥</span>
          <span>קבוצות</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="icon">📈</span>
          <span>דוחות</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="icon">⚙️</span>
          <span>הגדרות</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
