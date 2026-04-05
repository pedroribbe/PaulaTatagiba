import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';
import { useAuth } from '../lib/authContext';

export default function Login() {
  const [user, setUser]   = useState('');
  const [pass, setPass]   = useState('');
  const [err,  setErr]    = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(user.trim(), pass);
      signIn();
      navigate('/projetos');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      {/* Background ornament */}
      <div style={styles.orb} />

      <form onSubmit={handleSubmit} style={styles.card} noValidate>
        {/* Monogram */}
        <div style={styles.monogram}>TA</div>

        <div style={styles.brand}>
          <span style={styles.brandName}>Tatagiba Arquitetura</span>
          <span style={styles.brandSub}>Painel Administrativo</span>
        </div>

        <div style={styles.divider} />

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={user}
            onChange={e => setUser(e.target.value)}
            placeholder="seu@email.com"
            required
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••••••"
            required
          />
        </div>

        {err && <p style={styles.err}><span className="icon" style={{fontSize:'1rem'}}>error</span> {err}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '.85rem' }}
          disabled={loading || !user || !pass}
        >
          {loading ? <span className="spinner" /> : <><span className="icon">login</span> Entrar</>}
        </button>
      </form>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: '600px', height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(116,89,74,.12) 0%, transparent 70%)',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    background: 'var(--surface-1)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
  },
  monogram: {
    width: '52px', height: '52px',
    borderRadius: '12px',
    background: 'var(--accent)',
    color: '#f4ede8',
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 800,
    fontSize: '1.15rem',
    letterSpacing: '.1em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '.25rem',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.2rem',
  },
  brandName: {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 800,
    fontSize: '1.05rem',
    letterSpacing: '.04em',
  },
  brandSub: {
    fontSize: '.75rem',
    color: 'var(--text-3)',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '.25rem 0',
  },
  err: {
    display: 'flex',
    alignItems: 'center',
    gap: '.4rem',
    color: '#e08080',
    fontSize: '.82rem',
    background: 'rgba(196,78,78,.1)',
    border: '1px solid rgba(196,78,78,.25)',
    borderRadius: 'var(--r)',
    padding: '.6rem .8rem',
  },
};
