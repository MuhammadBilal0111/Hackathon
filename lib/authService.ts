import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/firebase";

// Types
export interface AuthUser {
  uid: string;
  email: string | null;
}

// LocalStorage key
const USER_STORAGE_KEY = "user";

// Save user to localStorage
export const saveUserToLocalStorage = (user: User) => {
  const userData: AuthUser = {
    uid: user.uid,
    email: user.email,
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
};

// Get user from localStorage
export const getUserFromLocalStorage = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as AuthUser;
  } catch {
    return null;
  }
};

// Remove user from localStorage
export const removeUserFromLocalStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    saveUserToLocalStorage(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    saveUserToLocalStorage(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    saveUserToLocalStorage(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth);
    removeUserFromLocalStorage();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get friendly error message
export const getFriendlyErrorMessage = (error: string): string => {
  if (error.includes("email-already-in-use")) {
    return "This email is already registered. Please sign in instead.";
  }
  if (error.includes("weak-password")) {
    return "Password should be at least 6 characters long.";
  }
  if (error.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (error.includes("user-not-found")) {
    return "No account found with this email.";
  }
  if (error.includes("wrong-password")) {
    return "Incorrect password. Please try again.";
  }
  if (error.includes("invalid-credential")) {
    return "Invalid email or password. Please try again.";
  }
  if (error.includes("popup-closed-by-user")) {
    return "Sign-in cancelled. Please try again.";
  }
  if (error.includes("network-request-failed")) {
    return "Network error. Please check your connection.";
  }
  return "An error occurred. Please try again.";
};
