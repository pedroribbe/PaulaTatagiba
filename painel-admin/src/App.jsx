import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/authContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Projects from './pages/Projects';
import Texts from './pages/Texts';

function PrivateRoute({ children }) {
  const { logged, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  return logged ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { logged, loading } = useAuth();
  if (loading) return null;
  return (
    <Routes>
      <Route path="/" element={logged ? <Navigate to="/projetos" replace /> : <Login />} />
      <Route
        path="/projetos"
        element={<PrivateRoute><Layout page="projetos"><Projects /></Layout></PrivateRoute>}
      />
      <Route
        path="/textos"
        element={<PrivateRoute><Layout page="textos"><Texts /></Layout></PrivateRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
