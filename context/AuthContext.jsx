"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Creates users/{uid} on first login with role "user"
async function ensureProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  const data = {
    name: user.displayName || "",
    email: user.email,
    role: "user",
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, data);
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setProfile(u ? await ensureProfile(u) : null);
      setLoading(false);
    });
  }, []);

  // each returns the role so the page can redirect
  const login = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return (await ensureProfile(user)).role;
  };

  const signup = async (name, email, password) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const p = await ensureProfile(user);
    await setDoc(doc(db, "users", user.uid), { name }, { merge: true });
    setProfile({ ...p, name });
    return p.role;
  };

  const googleLogin = async () => {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
    return (await ensureProfile(user)).role;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role,
        loading,
        login,
        signup,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
