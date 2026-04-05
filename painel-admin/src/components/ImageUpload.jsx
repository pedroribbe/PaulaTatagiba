import { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * ImageUpload
 * props:
 *   onUpload(url: string) — chamado quando upload termina com a URL pública
 *   label? — texto do botão (default: "Enviar Foto")
 *   accept? — tipos aceitos (default: "image/*")
 */
export default function ImageUpload({ onUpload, label = 'Enviar Foto', accept = 'image/*' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]  = useState(0);
  const [error, setError]        = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const ext  = file.name.split('.').pop();
      const path = `images/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve
        );
      });

      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '.3rem' }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
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
          ? <><span className="spinner" style={{ width: 14, height: 14 }} /> {progress}%</>
          : <><span className="icon" style={{ fontSize: '1rem' }}>upload</span> {label}</>
        }
      </button>
      {error && <span style={{ fontSize: '.72rem', color: 'var(--err)' }}>{error}</span>}
    </div>
  );
}
