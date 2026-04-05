import { useState, useEffect } from 'react';
import { getFile, saveFile } from '../lib/api';
import ImageUpload from '../components/ImageUpload';
import { useToastCtx } from '../components/Layout';

const DEFAULT = {
  geral: {
    logo: '',
  },
  home: {
    foto_capa: '',
    manifesto_titulo: '',
    manifesto_texto: '',
    foto_atelier: '',
    expertise: [
      { numero: '01', titulo: '', texto: '' },
      { numero: '02', titulo: '', texto: '' },
      { numero: '03', titulo: '', texto: '' },
    ],
  },
  sobre: {
    fotos: [],
    foto_fundo: '',
    valores: [
      { titulo: 'Curadoria Técnica', texto: '' },
      { titulo: 'Luz como Estrutura', texto: '' },
      { titulo: 'Naturalismo Moderno', texto: '' },
    ],
    destaque_titulo: '',
    destaque_texto: '',
    bio_p1: '',
    bio_p2: '',
  },
  contato: {
    mostrar_endereco: true,
    endereco: '',
    telefone: '',
    email: '',
    instagram: '',
  },
};

const TABS = [
  { key: 'geral',   label: 'Geral'   },
  { key: 'contato', label: 'Contato' },
  { key: 'sobre',   label: 'Sobre'   },
  { key: 'home',    label: 'Home'    },
];

export default function Texts() {
  const { ok, err } = useToastCtx();
  const [content, setContent] = useState(DEFAULT);
  const [sha, setSha]             = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [tab, setTab]             = useState('geral');
  const [newFotoUrl, setNewFotoUrl] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data, sha } = await getFile('data/content.json');
      // migrate sobre.foto → sobre.fotos
      const fotos = data.sobre?.fotos?.length
        ? data.sobre.fotos
        : data.sobre?.foto ? [data.sobre.foto] : [];
      setContent({
        ...DEFAULT,
        ...data,
        geral:   { ...DEFAULT.geral,   ...(data.geral   || {}) },
        home:    { ...DEFAULT.home,    ...(data.home    || {}), expertise: data.home?.expertise  || DEFAULT.home.expertise },
        sobre:   { ...DEFAULT.sobre,   ...(data.sobre   || {}), fotos, valores: data.sobre?.valores || DEFAULT.sobre.valores },
        contato: { ...DEFAULT.contato, ...(data.contato || {}) },
      });
      setSha(sha);
    } catch (e) {
      err(e.message);
    } finally {
      setLoading(false);
    }
  }

  function set(section, field, value) {
    setContent(c => ({ ...c, [section]: { ...c[section], [field]: value } }));
  }

  function setExpertise(idx, field, value) {
    setContent(c => {
      const expertise = [...c.home.expertise];
      expertise[idx] = { ...expertise[idx], [field]: value };
      return { ...c, home: { ...c.home, expertise } };
    });
  }

  function setValor(idx, field, value) {
    setContent(c => {
      const valores = [...(c.sobre.valores || [])];
      valores[idx] = { ...valores[idx], [field]: value };
      return { ...c, sobre: { ...c.sobre, valores } };
    });
  }

  function addFoto(url) {
    if (!url.trim()) return;
    setContent(c => ({ ...c, sobre: { ...c.sobre, fotos: [...(c.sobre.fotos || []), url.trim()] } }));
    setNewFotoUrl('');
  }

  function removeFoto(idx) {
    setContent(c => ({ ...c, sobre: { ...c.sobre, fotos: (c.sobre.fotos || []).filter((_, i) => i !== idx) } }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await saveFile('data/content.json', content, sha, 'painel: atualiza textos do site');
      setSha(result.content.sha);
      ok('Textos salvos com sucesso!');
    } catch (e) {
      err(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="empty-state"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>Textos do Site</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <span className="spinner" /> : <span className="icon">save</span>}
          Salvar
        </button>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GERAL ─────────────────────────────────────────────────── */}
      {tab === 'geral' && (
        <div className="section-group">
          <p className="section-title">Identidade Visual</p>
          <div className="field">
            <label>Logo do Escritório</label>
            <p style={{ fontSize: '.78rem', color: 'var(--text-3)', marginBottom: '.5rem' }}>
              Aparece no quadrado verde na página Sobre. Use apenas a parte gráfica, sem o texto "Tatagiba Arquitetura".
            </p>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input
                value={content.geral.logo}
                onChange={e => set('geral', 'logo', e.target.value)}
                placeholder="https://... ou use o botão para upload"
                style={{ flex: 1 }}
              />
              <ImageUpload label="Upload" onUpload={url => set('geral', 'logo', url)} />
            </div>
            {content.geral.logo && (
              <div style={{ marginTop: '.75rem', background: 'var(--accent)', padding: '1rem', display: 'inline-flex', borderRadius: 'var(--r)', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={content.geral.logo}
                  alt="Preview da logo"
                  style={{ width: 72, height: 72, objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONTATO ───────────────────────────────────────────────── */}
      {tab === 'contato' && (
        <div className="section-group">
          <p className="section-title">Informações de Contato</p>
          <div className="field" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ margin: 0 }}>Mostrar Endereço no site</label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={content.contato.mostrar_endereco !== false}
                onChange={e => set('contato', 'mostrar_endereco', e.target.checked)}
              />
              <span className="toggle-track" />
              <span className="toggle-thumb" />
            </label>
          </div>
          <div className="field">
            <label>Endereço</label>
            <input
              value={content.contato.endereco}
              onChange={e => set('contato', 'endereco', e.target.value)}
              placeholder="Rua Visconde de Pirajá, Ipanema, Rio de Janeiro, RJ"
            />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input
              value={content.contato.telefone}
              onChange={e => set('contato', 'telefone', e.target.value)}
              placeholder="+55 21 99999-9999"
            />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              value={content.contato.email}
              onChange={e => set('contato', 'email', e.target.value)}
              placeholder="contato@tatagiba.arq.br"
            />
          </div>
          <div className="field">
            <label>Instagram</label>
            <input
              value={content.contato.instagram}
              onChange={e => set('contato', 'instagram', e.target.value)}
              placeholder="@tatagiba.arquitetura"
            />
          </div>
        </div>
      )}

      {/* ── SOBRE ─────────────────────────────────────────────────── */}
      {tab === 'sobre' && (
        <>
          {/* Fotos de Paula */}
          <div className="section-group">
            <p className="section-title">Fotos de Paula</p>
            <p style={{ fontSize: '.78rem', color: 'var(--text-3)', marginBottom: '1rem' }}>
              Adicione uma ou mais fotos. A primeira é a principal; as demais formam um slideshow automático.
            </p>
            {(content.sobre.fotos || []).length > 0 && (
              <div className="gallery-grid" style={{ marginBottom: '1rem' }}>
                {(content.sobre.fotos || []).map((src, i) => (
                  <div key={i} className="gallery-item">
                    <img src={src} alt="" />
                    {i === 0 && (
                      <span style={{ position: 'absolute', top: 4, left: 4, background: 'var(--accent)', color: '#f4ede8', fontSize: '.6rem', padding: '2px 6px', borderRadius: 2, fontWeight: 700, letterSpacing: '.04em' }}>
                        Principal
                      </span>
                    )}
                    <button className="remove-btn" onClick={() => removeFoto(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="field">
              <label>Adicionar foto</label>
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <input
                  value={newFotoUrl}
                  onChange={e => setNewFotoUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addFoto(newFotoUrl)}
                  placeholder="https://... ou use o botão para upload"
                  style={{ flex: 1 }}
                />
                <button className="btn btn-ghost" onClick={() => addFoto(newFotoUrl)}>
                  <span className="icon">add</span>
                </button>
                <ImageUpload
                  label="Upload"
                  onUpload={url => setContent(c => ({ ...c, sobre: { ...c.sobre, fotos: [...(c.sobre.fotos || []), url] } }))}
                />
              </div>
            </div>
          </div>

          {/* Biografia */}
          <div className="section-group">
            <p className="section-title">Biografia</p>
            <div className="field">
              <label>Parágrafo 1</label>
              <textarea rows={4} value={content.sobre.bio_p1} onChange={e => set('sobre', 'bio_p1', e.target.value)} />
            </div>
            <div className="field">
              <label>Parágrafo 2</label>
              <textarea rows={4} value={content.sobre.bio_p2} onChange={e => set('sobre', 'bio_p2', e.target.value)} />
            </div>
          </div>

          {/* Foto de Fundo */}
          <div className="section-group">
            <p className="section-title">Foto de Fundo</p>
            <p style={{ fontSize: '.78rem', color: 'var(--text-3)', marginBottom: '.5rem' }}>
              Foto em preto e branco na seção inferior da página Sobre.
            </p>
            <div className="field">
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <input
                  value={content.sobre.foto_fundo}
                  onChange={e => set('sobre', 'foto_fundo', e.target.value)}
                  placeholder="https://... ou use o botão para upload"
                  style={{ flex: 1 }}
                />
                <ImageUpload label="Upload" onUpload={url => set('sobre', 'foto_fundo', url)} />
              </div>
              {content.sobre.foto_fundo && (
                <img
                  src={content.sobre.foto_fundo}
                  alt=""
                  className="img-preview"
                  style={{ maxWidth: 280, marginTop: '.5rem' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          </div>

          {/* Valores */}
          <div className="section-group">
            <p className="section-title">Valores (3 blocos)</p>
            {(content.sobre.valores || []).map((item, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '.85rem', marginBottom: '.75rem' }}>
                <p style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  {['Curadoria Técnica', 'Luz como Estrutura', 'Naturalismo Moderno'][i] || `Bloco ${i + 1}`}
                </p>
                <div className="field">
                  <label>Título</label>
                  <input value={item.titulo} onChange={e => setValor(i, 'titulo', e.target.value)} />
                </div>
                <div className="field">
                  <label>Descrição</label>
                  <textarea rows={2} value={item.texto} onChange={e => setValor(i, 'texto', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Destaque */}
          <div className="section-group">
            <p className="section-title">Destaque</p>
            <p style={{ fontSize: '.78rem', color: 'var(--text-3)', marginBottom: '.5rem' }}>
              Bloco de texto ao lado da foto de fundo ("Onde a estética encontra...").
            </p>
            <div className="field">
              <label>Título</label>
              <textarea rows={2} value={content.sobre.destaque_titulo} onChange={e => set('sobre', 'destaque_titulo', e.target.value)} />
            </div>
            <div className="field">
              <label>Texto</label>
              <textarea rows={3} value={content.sobre.destaque_texto} onChange={e => set('sobre', 'destaque_texto', e.target.value)} />
            </div>
          </div>
        </>
      )}

      {/* ── HOME ──────────────────────────────────────────────────── */}
      {tab === 'home' && (
        <div className="section-group">
          <p className="section-title">Manifesto</p>
          <div className="field">
            <label>Foto da Capa (Hero)</label>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input
                value={content.home.foto_capa}
                onChange={e => set('home', 'foto_capa', e.target.value)}
                placeholder="https://... ou use o botão para upload"
                style={{ flex: 1 }}
              />
              <ImageUpload label="Upload" onUpload={url => set('home', 'foto_capa', url)} />
            </div>
            {content.home.foto_capa && (
              <img src={content.home.foto_capa} alt="" className="img-preview" style={{ maxWidth: 220, marginTop: '.5rem' }} onError={e => { e.target.style.display = 'none'; }} />
            )}
          </div>
          <div className="divider" />
          <div className="field">
            <label>Foto do Atelier (seção Expertise)</label>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input
                value={content.home.foto_atelier}
                onChange={e => set('home', 'foto_atelier', e.target.value)}
                placeholder="https://... ou use o botão para upload"
                style={{ flex: 1 }}
              />
              <ImageUpload label="Upload" onUpload={url => set('home', 'foto_atelier', url)} />
            </div>
            {content.home.foto_atelier && (
              <img src={content.home.foto_atelier} alt="" className="img-preview" style={{ maxWidth: 220, marginTop: '.5rem' }} onError={e => { e.target.style.display = 'none'; }} />
            )}
          </div>
          <div className="divider" />
          <div className="field">
            <label>Título do Manifesto</label>
            <textarea rows={2} value={content.home.manifesto_titulo} onChange={e => set('home', 'manifesto_titulo', e.target.value)} />
          </div>
          <div className="field">
            <label>Texto</label>
            <textarea rows={3} value={content.home.manifesto_texto} onChange={e => set('home', 'manifesto_texto', e.target.value)} />
          </div>
          <div className="divider" />
          <p className="section-title">Expertise</p>
          {(content.home.expertise || []).map((item, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
              <p style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {item.numero}
              </p>
              <div className="field">
                <label>Título</label>
                <input value={item.titulo} onChange={e => setExpertise(i, 'titulo', e.target.value)} />
              </div>
              <div className="field">
                <label>Descrição</label>
                <textarea rows={2} value={item.texto} onChange={e => setExpertise(i, 'texto', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
