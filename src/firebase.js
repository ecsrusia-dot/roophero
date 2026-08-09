// Firestore 초기화 및 저장/불러오기.
// .env 에 Firebase 설정이 없으면 localStorage 로 대체 동작한다 (오프라인 개발용).
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const LOCAL_KEY = "roophero_save_v1";

let db = null;
let uid = null;

// 익명 인증 후 uid 확보. 미설정 시 즉시 local 모드로 반환.
export async function initStorage() {
  if (!configured) return { mode: "local" };
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    const auth = getAuth(app);
    await signInAnonymously(auth);
    uid = await new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsub();
          resolve(user.uid);
        }
      });
    });
    return { mode: "firebase", uid };
  } catch (e) {
    console.warn("Firebase 초기화 실패, localStorage 모드로 전환:", e);
    db = null;
    return { mode: "local" };
  }
}

export async function loadSave() {
  if (db && uid) {
    const snap = await getDoc(doc(db, "saves", uid));
    return snap.exists() ? snap.data() : null;
  }
  const raw = localStorage.getItem(LOCAL_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSave(data) {
  if (db && uid) {
    await setDoc(doc(db, "saves", uid), data);
    return;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}
