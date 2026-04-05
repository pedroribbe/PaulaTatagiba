import { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

const MAX_WIDTH  = 2400; // px
const QUALITY    = 0.85;

/**
 * Comprime e redimensiona uma imagem via Canvas antes do upload.
 * Retorna um Blob JPEG otimizado.
 */
function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width  = MAX_WIDTH;
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', QUALITY);
    };
    img.src = url;
  });
}

/**
 * ImageUpload
 * props:
 *   onUpload(url: string) — chamado com a URL após cada upload concluído
 *   label?    — texto do botão
 *   accept?   — tipos aceitos (default: "image/*")
 *   multiple? — permite selecionar múltiplos arquivos (default: false)
 */
export default function ImageUpload({ onUpload, label = 'Enviar Foto', accept = 'image/*', multiple = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone]           = useState(0);
  const [total, setTotal]         = useState(0);
  const [error, setError]         = useState('');

  async function uploadOne(file) {
    const blob = await compressImage(file);
    const path = `images/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });

    await new Promise((resolve, reject) => {
      task.on('state_changed', null, reject, resolve);
    });

    const url = await getDownloadURL(storageRef);
    onUpload(url);
    setDone(d => d + 1);
  }

  async function handleFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError('');
    setUploading(true);
    setDone(0);
    setTotal(files.length);

    try {
      // Upload paralelo — todos os arquivos ao mesmo tempo
      await Promise.all(files.map(f => uploadOne(f)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setDone(0);
      setTotal(0);
      e.target.value = '';
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '.3rem' }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <button
        type="button"
        className="btn btn-ghost"
        style={{ fontSize: '.78rem' }}
        onClick={() => inputRef.current.click()}
        disabled={uploading}
      >
        {uploading
          ? <><span className="spinner" style={{ width: 14, height: 14 }} /> {done}/{total}</>
          : <><span className="icon" style={{ fontSize: '1rem' }}>upload</span> {label}</>
        }
      </button>
      {error && <span style={{ fontSize: '.72rem', color: 'var(--err)' }}>{error}</span>}
    </div>
  );
}
