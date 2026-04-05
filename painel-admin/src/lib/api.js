import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  await firebaseSignOut(auth);
}

export function isLoggedIn() {
  return !!auth.currentUser;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GITHUB_RAW = 'https://raw.githubusercontent.com/pedroribbe/PaulaTatagiba/master';

function docName(path) {
  if (path === 'data/content.json')  return 'content';
  if (path === 'data/projects.json') return 'projects';
  return path;
}

// ─── Firestore ───────────────────────────────────────────────────────────────

export async function getFile(path) {
  const name = docName(path);
  const snap = await getDoc(doc(db, 'settings', name));

  // Firestore tem dados → retorna normalmente
  if (snap.exists()) {
    return { data: snap.data(), sha: '' };
  }

  // Firestore vazio → busca do GitHub e salva (seed automático)
  try {
    const res  = await fetch(`${GITHUB_RAW}/${path}`);
    const data = await res.json();
    await setDoc(doc(db, 'settings', name), data);
    return { data, sha: '' };
  } catch {
    return { data: {}, sha: '' };
  }
}

export async function saveFile(path, content, _sha, _message) {
  await setDoc(doc(db, 'settings', docName(path)), content);
  return { content: { sha: '' } };
}
