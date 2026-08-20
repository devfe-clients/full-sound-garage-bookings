import { useSyncExternalStore } from "react";
import { isFirebaseConfigured } from "./firebase";

export type AppUser = { uid: string; name: string; email: string; photoURL?: string | undefined };

export const authEnabled = isFirebaseConfigured;

// Estado reativo do usuário
let currentUser: AppUser | null = null;
const authListeners = new Set<() => void>();

function notifyAuth() {
  authListeners.forEach((l) => l());
}

export function setCurrentUser(user: AppUser | null) {
  currentUser = user;
  notifyAuth();
}

export function useCurrentUser(): AppUser | null {
  return useSyncExternalStore(
    (listener) => {
      authListeners.add(listener);
      return () => authListeners.delete(listener);
    },
    () => currentUser,
    () => null,
  );
}
export async function signInWithGoogle(): Promise<AppUser | null> {
  if (!authEnabled) return null;
  const { signInWithPopup, signInWithRedirect, getRedirectResult } = await import("firebase/auth");
  const { auth, googleProvider } = await import("./firebase");
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const user: AppUser = {
      uid: cred.user.uid,
      name: cred.user.displayName ?? "",
      email: cred.user.email ?? "",
      ...(cred.user.photoURL ? { photoURL: cred.user.photoURL } : {}),
    };
    setCurrentUser(user);
    return user;
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw err;
  }
}

export async function signOut(): Promise<void> {
  if (!authEnabled) return;
  const { auth } = await import("./firebase");
  await auth.signOut();
  setCurrentUser(null);
}

let _listenerInit = false;

export function initAuthListener() {
  if (_listenerInit || !authEnabled) return;
  _listenerInit = true;
  import("./firebase").then(({ auth }) => {
    import("firebase/auth").then(({ onAuthStateChanged, getRedirectResult }) => {
      getRedirectResult(auth).then((result) => {
        if (result?.user) {
          setCurrentUser({
            uid: result.user.uid,
            name: result.user.displayName ?? "",
            email: result.user.email ?? "",
            ...(result.user.photoURL ? { photoURL: result.user.photoURL } : {}),
          });
        }
      }).catch(() => {});

      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setCurrentUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName ?? "",
            email: firebaseUser.email ?? "",
            ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
          });
        } else {
          setCurrentUser(null);
        }
      });
    });
  });
}