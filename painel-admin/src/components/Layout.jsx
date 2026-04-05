import { createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

export const ToastCtx = createContext({ ok: () => {}, err: () => {}, info: () => {} });
export const useToastCtx = () => useContext(ToastCtx);

export default function Layout({ page, children }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toasts, ok, err, info } = useToast();

  function handleLogout() {
    signOut();
    navigate('/');
  }

  return (
    <ToastCtx.Provider value={{ ok, err, info }}>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <span className="sidebar-brand-name">Tatagiba</span>
              <span className="sidebar-brand-sub">Painel Admin</span>
            </div>
            <nav className="sidebar-nav">
              <Link to="/projetos" className={`nav-item${page === 'projetos' ? ' active' : ''}`}>
                <span className="icon">grid_view</span>
                Projetos
              </Link>
              <Link to="/textos" className={`nav-item${page === 'textos' ? ' active' : ''}`}>
                <span className="icon">edit_note</span>
                Textos
              </Link>
            </nav>
          </div>
          <button className="btn btn-ghost nav-logout" onClick={handleLogout}>
            <span className="icon">logout</span>
            Sair
          </button>
        </aside>
        <div className="main-content">
          {children}
        </div>
      </div>
      <Toast toasts={toasts} />
    </ToastCtx.Provider>
  );
}
