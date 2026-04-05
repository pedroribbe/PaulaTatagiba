import { useState, useEffect } from 'react';
import { getFile, saveFile } from '../lib/api';
import { useToastCtx } from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';

const CATS = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial',   label: 'Comercial' },
  { value: 'infantil',    label: 'Infantil' },
];
const BADGE       = { residencial: 'badge-res', comercial: 'badge-com', infantil: 'badge-inf' };
const BADGE_LABEL = { residencial: 'Residencial', comercial: 'Comercial', infantil: 'Infantil' };

function emptyProject() {
  return { id: '', name: '', category: 'residencial', image: '', images: [], featured: false };
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function Projects() {
  const { ok, err } = useToastCtx();
  const [projects, setProjects] = useState([]);
  const [sha, setSha]           = useState('');
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [modal, setModal]       = useState(null); // null | { mode: 'add'|'edit', data: {} }
  const [delTarget, setDelTarget] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data, sha } = await getFile('data/projects.json');
      setProjects(data.projects || []);
      setSha(sha);
    } catch (e) {
      err(e.message);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setModal({ mode: 'add', data: emptyProject() });
    setNewImageUrl('');
  }

  function openEdit(p) {
    setModal({ mode: 'edit', data: { ...p, images: [...(p.images || [])] } });
    setNewImageUrl('');
  }

  function modalSet(field, value) {
    setModal(m => ({ ...m, data: { ...m.data, [field]: value } }));
  }

  function addImage() {
    const url = newImageUrl.trim();
    if (!url) return;
    setModal(m => ({ ...m, data: { ...m.data, images: [...(m.data.images || []), url] } }));
    setNewImageUrl('');
  }

  function removeImage(idx) {
    setModal(m => ({
      ...m,
      data: { ...m.data, images: m.data.images.filter((_, i) => i !== idx) },
    }));
  }

  async function handleModalSave() {
    const p = { ...modal.data };
    if (!p.name.trim()) { err('Nome é obrigatório.'); return; }
    if (!p.id) p.id = slugify(p.name);
    if (!p.images.length && p.image) p.images = [p.image];

    const updated = modal.mode === 'add'
      ? [...projects, p]
      : projects.map(x => x.id === p.id ? p : x);

    setSaving(true);
    try {
      const result = await saveFile(
        'data/projects.json',
        { projects: updated },
        sha,
        `painel: ${modal.mode === 'add' ? 'adiciona' : 'edita'} "${p.name}"`
      );
      setSha(result.content.sha);
      setProjects(updated);
      ok('Salvo com sucesso!');
      setModal(null);
    } catch (e) {
      err(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const target = delTarget;
    setDelTarget(null);
    const updated = projects.filter(p => p.id !== target.id);
    setSaving(true);
    try {
      const result = await saveFile(
        'data/projects.json',
        { projects: updated },
        sha,
        `painel: remove "${target.name}"`
      );
      setSha(result.content.sha);
      setProjects(updated);
      ok('Projeto removido.');
    } catch (e) {
      err(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Projetos</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <span className="icon">add</span> Novo Projeto
        </button>
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" /></div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <span className="icon">grid_off</span>
          <p>Nenhum projeto cadastrado.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p.id} className="project-card">
              {p.image
                ? <img src={p.image} alt={p.name} className="project-thumb" />
                : <div className="project-thumb-placeholder"><span className="icon">image</span></div>
              }
              <div className="project-info">
                <h3>{p.name}</h3>
                <div className="project-meta">
                  <span className={`badge ${BADGE[p.category]}`}>{BADGE_LABEL[p.category]}</span>
                  {p.featured && <span className="badge badge-feat">Destaque</span>}
                  <span style={{ color: 'var(--text-3)', fontSize: '.72rem' }}>
                    {(p.images || []).length} foto{(p.images || []).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="project-actions">
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '.75rem', padding: '.4rem .75rem' }}
                    onClick={() => openEdit(p)}
                  >
                    <span className="icon" style={{ fontSize: '.9rem' }}>edit</span> Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: '.75rem', padding: '.4rem .75rem' }}
                    onClick={() => setDelTarget(p)}
                    disabled={saving}
                  >
                    <span className="icon" style={{ fontSize: '.9rem' }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal add/edit */}
      {modal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal.mode === 'add' ? 'Novo Projeto' : 'Editar Projeto'}</h2>
              <button className="btn-icon" onClick={() => setModal(null)}>
                <span className="icon">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Nome</label>
                <input
                  value={modal.data.name}
                  onChange={e => modalSet('name', e.target.value)}
                  placeholder="Ex: Casa Itanhangá"
                />
              </div>
              <div className="field">
                <label>Categoria</label>
                <select value={modal.data.category} onChange={e => modalSet('category', e.target.value)}>
                  {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Foto de Capa</label>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                  <input
                    value={modal.data.image}
                    onChange={e => modalSet('image', e.target.value)}
                    placeholder="https://... ou use o botão para upload"
                    style={{ flex: 1 }}
                  />
                  <ImageUpload label="Upload" onUpload={url => modalSet('image', url)} />
                </div>
                {modal.data.image && (
                  <img
                    src={modal.data.image}
                    alt=""
                    className="img-preview"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>
              <div className="field">
                <label>Galeria de Fotos</label>
                <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginBottom: '.4rem' }}>
                  Clique em ★ em qualquer foto para usá-la como capa.
                </p>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <input
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addImage()}
                    placeholder="Cole a URL e pressione Enter ou clique em +"
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-ghost" onClick={addImage}>
                    <span className="icon">add</span>
                  </button>
                </div>
                <ImageUpload
                  label="Upload para galeria"
                  multiple
                  onUpload={url => setModal(m => {
                    const images = [...(m.data.images || []), url];
                    // primeira foto enviada vira capa automaticamente
                    const image = m.data.image || url;
                    return { ...m, data: { ...m.data, images, image } };
                  })}
                />
                {(modal.data.images || []).length > 0 && (
                  <div className="gallery-grid" style={{ marginTop: '.5rem' }}>
                    {modal.data.images.map((src, i) => (
                      <div key={i} className="gallery-item">
                        <img src={src} alt="" />
                        <button
                          className="remove-btn"
                          style={{ right: 'auto', left: 4, background: modal.data.image === src ? '#c8a96e' : 'rgba(0,0,0,.45)', fontSize: '0.7rem' }}
                          title="Definir como capa"
                          onClick={() => modalSet('image', src)}
                        >★</button>
                        <button className="remove-btn" onClick={() => removeImage(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="field" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ margin: 0 }}>Destaque na Home</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={modal.data.featured}
                    onChange={e => modalSet('featured', e.target.checked)}
                  />
                  <span className="toggle-track" />
                  <span className="toggle-thumb" />
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleModalSave} disabled={saving}>
                {saving ? <span className="spinner" /> : <span className="icon">save</span>}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {delTarget && (
        <ConfirmDialog
          message={`Remover "${delTarget.name}" permanentemente?`}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
          danger
        />
      )}
    </>
  );
}
