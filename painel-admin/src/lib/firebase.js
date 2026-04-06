import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            "AIzaSyBo0HJWT_OMe6SkBIcQ0gmHoym-I8wDpyw",
  authDomain:        "tatagiba-arquitetura.firebaseapp.com",
  projectId:         "tatagiba-arquitetura",
  storageBucket:     "tatagiba-arquitetura.firebasestorage.app",
  messagingSenderId: "649936737333",
  appId:             "1:649936737333:web:661bae2f86310a8c128d7c",
};

export const app     = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentSingleTabManager() }),
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);
