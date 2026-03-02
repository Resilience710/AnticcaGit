import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAuthDeferred } from '../lib/firebase';
import { User } from '../types';

// Admin emails - these users will automatically get admin role
const ADMIN_EMAILS = ['direncuy@gmail.com', 'admin@anticca.com.tr'];

interface AuthContextType {
  currentUser: any;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserData(uid: string, email?: string | null) {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();

      // Auto-promote to admin if email is in ADMIN_EMAILS list
      if (email && ADMIN_EMAILS.includes(email.toLowerCase()) && data.role !== 'admin') {
        await updateDoc(userDocRef, { role: 'admin', updatedAt: serverTimestamp() });
        setUserData({ ...data, uid, role: 'admin' } as User);
        console.log('User promoted to admin:', email);
      } else {
        setUserData({ ...data, uid } as User);
      }
    }
  }

  async function login(email: string, password: string) {
    const [authInstance, { signInWithEmailAndPassword }] = await Promise.all([
      getAuthDeferred(),
      import('firebase/auth'),
    ]);
    const result = await signInWithEmailAndPassword(authInstance!, email, password);
    await fetchUserData(result.user.uid, result.user.email);
  }

  async function register(email: string, password: string, name: string) {
    const [authInstance, { createUserWithEmailAndPassword }] = await Promise.all([
      getAuthDeferred(),
      import('firebase/auth'),
    ]);
    const result = await createUserWithEmailAndPassword(authInstance!, email, password);

    // Check if user should be admin
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());

    // Create user document in Firestore
    const userDoc: Omit<User, 'uid'> = {
      name,
      email,
      role: isAdminEmail ? 'admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', result.user.uid), {
      ...userDoc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setUserData({ ...userDoc, uid: result.user.uid } as User);

    if (isAdminEmail) {
      console.log('Admin account created:', email);
    }
  }

  async function logout() {
    const [authInstance, { signOut }] = await Promise.all([
      getAuthDeferred(),
      import('firebase/auth'),
    ]);
    await signOut(authInstance!);
    setUserData(null);
  }

  async function resetPassword(email: string) {
    const [authInstance, { sendPasswordResetEmail }] = await Promise.all([
      getAuthDeferred(),
      import('firebase/auth'),
    ]);
    await sendPasswordResetEmail(authInstance!, email);
  }

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Defer auth listener setup — does not block first paint
    getAuthDeferred().then(async (authInstance) => {
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(authInstance!, async (user) => {
        setCurrentUser(user);
        if (user) {
          await fetchUserData(user.uid, user.email);
        } else {
          setUserData(null);
        }
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const isAdmin = userData?.role === 'admin';

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
