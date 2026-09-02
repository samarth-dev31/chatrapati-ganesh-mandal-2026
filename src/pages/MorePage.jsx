import { useState } from "react";
import { ShieldCheck, LogOut, Heart, Info, Lock, Sparkles } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Banner from "../components/ui/Banner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditorLoginModal from "../components/more/EditorLoginModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  MANDAL_NAME,
  FESTIVAL_LINE,
  GREETING,
  APP_VERSION,
} from "../lib/constants";

function SectionTitle({ children }) {
  return (
    <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-cream-300/70">
      {children}
    </h2>
  );
}

export default function MorePage() {
  const { isEditor, user, signOut, isSupabaseConfigured } = useAuth();
  const toast = useToast();
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out of editor mode.");
    setLogoutOpen(false);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader title="More" subtitle="Editor access, about & app info" showBadge={false} />

      {/* Editor Mode */}
      <SectionTitle>Editor Mode</SectionTitle>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/[0.06] p-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl2 ${
              isEditor
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-gradient-to-b from-saffron-500/25 to-gold-500/10 text-saffron-300"
            }`}
          >
            {isEditor ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-cream-50">
              {isEditor ? "Editor mode is active" : "You're in view-only mode"}
            </p>
            <p className="truncate text-xs text-cream-300">
              {isEditor
                ? user?.email
                  ? `Signed in · ${user.email}`
                  : "You can add, edit and delete records."
                : "Anyone can view. Sign in to make changes."}
            </p>
          </div>
        </div>

        <div className="p-4">
          {isEditor ? (
            <Button variant="danger" className="w-full" onClick={() => setLogoutOpen(true)}>
              <LogOut className="h-4 w-4" /> Exit editor mode
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setLoginOpen(true)}>
              <ShieldCheck className="h-4 w-4" /> Enter editor mode
            </Button>
          )}
        </div>
      </Card>

      {!isSupabaseConfigured && (
        <div className="mt-3">
          <Banner tone="warn" title="Backend not connected">
            Editor mode needs Supabase keys in <code className="font-mono text-[11px]">.env</code>.
            Until then the app shows sample data.
          </Banner>
        </div>
      )}

      {/* About */}
      <div className="mt-7">
        <SectionTitle>About Mandal</SectionTitle>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-gradient-to-b from-saffron-400 to-saffron-600 text-2xl shadow-glow">
              🪷
            </span>
            <div>
              <p className="font-deva text-sm text-gold-300">{GREETING}</p>
              <h3 className="text-base font-bold text-cream-50">{MANDAL_NAME}</h3>
            </div>
          </div>
          <p className="font-deva mt-3 text-sm font-medium text-cream-200">{FESTIVAL_LINE}</p>
          <p className="mt-3 text-sm leading-relaxed text-cream-300">
            This tracker keeps the mandal's Ganeshotsav accounts open and honest — every
            rupee collected from our community and every rupee spent on the celebration,
            recorded for all to see. May Bappa bless our village with prosperity and unity.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl2 border border-white/[0.06] bg-ink-850 px-3.5 py-2.5 text-xs text-cream-300">
            <Heart className="h-4 w-4 shrink-0 text-saffron-400" aria-hidden="true" />
            Maintained by the Ganeshotsav committee, Wadwani.
          </div>
        </Card>
      </div>

      {/* App info */}
      <div className="mt-7">
        <SectionTitle>App Info</SectionTitle>
        <Card className="divide-y divide-white/[0.06]">
          <Row icon={Info} label="Version" value={APP_VERSION} />
          <Row icon={Sparkles} label="Made for" value="Ganeshotsav 2026" />
          <Row
            icon={ShieldCheck}
            label="Data"
            value={isSupabaseConfigured ? "Live (Supabase)" : "Sample preview"}
          />
        </Card>
        <p className="mt-3 px-1 text-center text-xs text-cream-300/60">
          गणपती बाप्पा मोरया · मंगलमूर्ती मोरया
        </p>
      </div>

      <EditorLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Exit editor mode?"
        message="You'll return to view-only mode and will need the password to make changes again."
        confirmLabel="Exit"
        tone="danger"
      />
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Icon className="h-4 w-4 text-cream-300" aria-hidden="true" />
      <span className="text-sm text-cream-200">{label}</span>
      <span className="ml-auto text-sm font-medium text-cream-50">{value}</span>
    </div>
  );
}
