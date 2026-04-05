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

// ─── Firestore ───────────────────────────────────────────────────────────────

function docName(path) {
  if (path === 'data/content.json')  return 'content';
  if (path === 'data/projects.json') return 'projects';
  return path;
}

export async function getFile(path) {
  const snap = await getDoc(doc(db, 'settings', docName(path)));
  return { data: snap.exists() ? snap.data() : {}, sha: '' };
}

export async function saveFile(path, content, _sha, _message) {
  await setDoc(doc(db, 'settings', docName(path)), content);
  return { content: { sha: '' } };
}
