import BrandHeader from "../components/dashboard/BrandHeader";
import SummaryCards from "../components/dashboard/SummaryCards";
import RecentActivity from "../components/dashboard/RecentActivity";
import Spinner from "../components/ui/Spinner";
import Banner from "../components/ui/Banner";
import { useData } from "../context/DataContext";

export default function HomePage({ onNavigate }) {
  const { expenses, collections, totals, loading, error, refresh } = useData();

  return (
    <div className="animate-fade-up">
      <BrandHeader />

      {error && (
        <div className="mb-4">
          <Banner tone="error" title="Couldn't load data" onRetry={refresh}>
            {error}
          </Banner>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading the mandal's ledger…" />
      ) : (
        <>
          <SummaryCards totals={totals} />
          <RecentActivity
            expenses={expenses}
            collections={collections}
            onSeeAll={() => onNavigate("expenses")}
          />
        </>
      )}
    </div>
  );
}
