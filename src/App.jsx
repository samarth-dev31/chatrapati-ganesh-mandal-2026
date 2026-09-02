import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import BottomNav from "./components/layout/BottomNav";
import DesktopSidebar from "./components/layout/DesktopSidebar";
import HomePage from "./pages/HomePage";
import ExpensesPage from "./pages/ExpensesPage";
import CollectionPage from "./pages/CollectionPage";
import MorePage from "./pages/MorePage";

const PAGES = {
  home: HomePage,
  expenses: ExpensesPage,
  collection: CollectionPage,
  more: MorePage,
};

const VALID = Object.keys(PAGES);

function readHash() {
  const h = window.location.hash.replace("#/", "").replace("#", "");
  return VALID.includes(h) ? h : "home";
}

function Shell() {
  const [page, setPage] = useState(readHash);

  useEffect(() => {
    const onHash = () => setPage(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((next) => {
    if (!VALID.includes(next)) return;
    window.location.hash = `/${next}`;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const Active = PAGES[page];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl md:gap-0">
      <DesktopSidebar current={page} onNavigate={navigate} />

      <main className="relative flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">
        <div className="mx-auto w-full max-w-xl md:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Active onNavigate={navigate} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav current={page} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <Shell />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
