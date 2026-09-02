import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase, isSupabaseConfigured, EDITOR_EMAILS } from "../lib/supabaseClient";

const AuthContext = createContext(null);

/**
 * Auth + editor authorisation.
 *
 * Public visitors never sign in. An editor opens "Editor Mode" and types a
 * password only; the app pairs it with each configured editor email in turn
 * (EDITOR_EMAILS) and calls Supabase Auth until one signs in. Editor
 * privileges are then confirmed by looking the signed-in email up in
 * public.editors — and, independently, enforced by RLS on every write.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isEditor, setIsEditor] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const mounted = useRef(true);

  const resolveEditor = useCallback(async (nextUser) => {
    if (!nextUser?.email || !supabase) {
      if (mounted.current) setIsEditor(false);
      return;
    }
    const { data, error } = await supabase
      .from("editors")
      .select("email")
      .eq("email", nextUser.email.toLowerCase())
      .maybeSingle();
    if (!mounted.current) return;
    setIsEditor(Boolean(data) && !error);
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user ?? null;
      if (!mounted.current) return;
      setUser(sessionUser);
      await resolveEditor(sessionUser);
      if (mounted.current) setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      if (!mounted.current) return;
      setUser(sessionUser);
      await resolveEditor(sessionUser);
    });

    return () => {
      mounted.current = false;
      sub?.subscription?.unsubscribe();
    };
  }, [resolveEditor]);

  const signIn = useCallback(async (password) => {
    if (!isSupabaseConfigured) {
      return { error: "The tracker isn't connected to its database yet. Add Supabase keys to enable Editor Mode." };
    }
    if (!EDITOR_EMAILS.length) {
      return { error: "Editor login isn't configured (missing VITE_EDITOR_EMAILS)." };
    }
    if (!password) {
      return { error: "Enter the editor password." };
    }

    // Try the password against each authorised editor email until one works.
    let signedInUser = null;
    let lastError = null;
    for (const email of EDITOR_EMAILS) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        signedInUser = data.user;
        break;
      }
      lastError = error;
    }

    if (!signedInUser) {
      const msg =
        lastError && !/invalid login credentials/i.test(lastError.message)
          ? lastError.message
          : "Incorrect password.";
      return { error: msg };
    }

    await resolveEditor(signedInUser);
    if (!mounted.current) return { error: null };

    // Signed in but the account isn't in public.editors — deny and sign back out.
    const { data: row } = await supabase
      .from("editors")
      .select("email")
      .eq("email", signedInUser.email.toLowerCase())
      .maybeSingle();

    if (!row) {
      await supabase.auth.signOut();
      return { error: "This account isn't authorised as an editor." };
    }

    return { error: null };
  }, [resolveEditor]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    if (mounted.current) {
      setUser(null);
      setIsEditor(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isEditor,
      authLoading,
      isSupabaseConfigured,
      signIn,
      signOut,
    }),
    [user, isEditor, authLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
