// Firebase Configuration for Anticca
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArg0ZchND1oauOq932hg-bX3JXUctdpW4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anticcareale.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anticcareale",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anticcareale.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "394629292480",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:394629292480:web:417db33b9fc0a0b91a2825",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-95JPJ4PNJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore & Storage are needed immediately for product data
export const db = getFirestore(app);
export const storage = getStorage(app);

// ─── Deferred Auth: loads after first paint to avoid blocking LCP ───
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null;
let _authPromise: Promise<any> | null = null;

export function getAuthDeferred() {
  if (_auth) return Promise.resolve(_auth);
  if (!_authPromise) {
    _authPromise = import("firebase/auth").then(({ getAuth }) => {
      _auth = getAuth(app);
      return _auth;
    });
  }
  return _authPromise;
}

// Synchronous getter for contexts that already awaited initialization
export function getAuthInstance() {
  return _auth;
}

// ─── Deferred Analytics: loads on first user interaction ───
if (typeof window !== "undefined") {
  let _analyticsLoaded = false;
  const loadAnalytics = () => {
    if (_analyticsLoaded) return;
    _analyticsLoaded = true;
    // Clean up all listeners
    ['scroll', 'mouseenter', 'touchstart', 'keydown'].forEach(e =>
      window.removeEventListener(e, loadAnalytics, true)
    );
    import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
      isSupported().then((ok) => { if (ok) getAnalytics(app); });
    });
  };
  // Trigger on first user interaction OR after 4s idle
  ['scroll', 'mouseenter', 'touchstart', 'keydown'].forEach(e =>
    window.addEventListener(e, loadAnalytics, { once: true, capture: true, passive: true })
  );
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(loadAnalytics, { timeout: 4000 });
  } else {
    setTimeout(loadAnalytics, 4000);
  }
}

export default app;
