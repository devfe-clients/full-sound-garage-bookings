import { isFirebaseConfigured } from "./firebase";

export type AppUser = { uid: string; name: string; email: string; photoURL?: string };

/**
 * Login com Google — desativado até o Firebase ser configurado.
 * Hoje o agendamento funciona sem exigir autenticação.
 */
export const authEnabled = isFirebaseConfigured;

export async function signInWithGoogle(): Promise<AppUser | null> {
  if (!authEnabled) return null;
  // const { signInWithPopup } = await import("firebase/auth");
  // const { auth, googleProvider } = await import("./firebase");
  // const cred = await signInWithPopup(auth, googleProvider);
  // return { uid: cred.user.uid, name: cred.user.displayName ?? "", email: cred.user.email ?? "" };
  return null;
}

export async function signOut(): Promise<void> {
  if (!authEnabled) return;
  // const { auth } = await import("./firebase");
  // await auth.signOut();
}