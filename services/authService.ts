import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Log environment variables
console.log('Firebase Environment Variables:');
console.log('API Key exists:', !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Auth Domain exists:', !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('Project ID exists:', !!import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('Full config:', firebaseConfig);

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  const missingVars = [];
  if (!firebaseConfig.apiKey) missingVars.push('VITE_FIREBASE_API_KEY');
  if (!firebaseConfig.authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID');
  
  console.error('Firebase configuration is incomplete. Missing variables:', missingVars);
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
}

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

try {
  console.log('Initializing Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
  
  console.log('Initializing Firebase Analytics...');
  analytics = getAnalytics(app);
  console.log('Firebase Analytics initialized');
  
  console.log('Initializing Firebase Auth...');
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
  
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  console.log('Google Auth Provider initialized');
  
  console.log('Firebase initialization completed successfully');
} catch (error: any) {
  console.error('Error initializing Firebase:', error);
  console.error('Error details:', error.message, error.stack);
  throw new Error(`Failed to initialize Firebase: ${error.message}`);
}

// Sign in with Google (with fallback to redirect)
export const signInWithGoogle = async () => {
  try {
    console.log('Attempting Google sign-in with popup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', result.user);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google popup:', error);
    
    // If popup is blocked, try redirect method
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Popup blocked, trying redirect method...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return null; // Redirect will handle the result
      } catch (redirectError) {
        console.error('Error with redirect sign-in:', redirectError);
        throw redirectError;
      }
    }
    
    throw error;
  }
};

// Check for redirect result on app load
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Redirect sign-in successful:', result.user);
      return result.user;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting redirect result:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    console.log('Attempting email sign-up...');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Email sign-up successful:', result.user);
    return result.user;
  } catch (error: any) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('Attempting email sign-in...');
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Email sign-in successful:', result.user);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, analytics };