import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, HandCoins, TrendingUp } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import TotalStrip from "../components/shared/TotalStrip";
import RecordRow from "../components/shared/RecordRow";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Banner from "../components/ui/Banner";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CollectionForm from "../components/collection/CollectionForm";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { paymentMeta } from "../lib/constants";

export default function CollectionPage() {
  const {
    collections,
    totals,
    loading,
    error,
    refresh,
    addCollection,
    updateCollection,
    deleteCollection,
  } = useData();
  const { isEditor } = useAuth();
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    const { error: err } = await deleteCollection(pendingDelete.id);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Collection deleted.");
    setPendingDelete(null);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Collection"
        subtitle="Contributions received"
        action={
          isEditor && (
            <Button size="sm" onClick={openAdd} className="shrink-0">
              <Plus className="h-4 w-4" /> Add
            </Button>
          )
        }
      />

      <TotalStrip
        label="Total Collection"
        value={totals.collection}
        icon={TrendingUp}
        tone="emerald"
        count={collections.length}
      />

      {error && (
        <div className="mt-4">
          <Banner tone="error" title="Couldn't load collections" onRetry={refresh}>
            {error}
          </Banner>
        </div>
      )}

      <div className="mt-4">
        {loading ? (
          <Spinner label="Loading collections…" />
        ) : collections.length === 0 ? (
          <EmptyState
            icon={HandCoins}
            title="No collections recorded yet"
            description={
              isEditor
                ? "Add the first contribution to start tracking the mandal's collection."
                : "Once the committee records contributions, they will show up here."
            }
            action={
              isEditor && (
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4" /> Add collection
                </Button>
              )
            }
          />
        ) : (
          <ul className="space-y-2.5">
            <AnimatePresence initial={false}>
              {collections.map((row) => {
                const meta = paymentMeta(row.payment_method);
                return (
                  <RecordRow
                    key={row.id}
                    icon={meta.icon}
                    iconTone="text-emerald-300 bg-emerald-500/15"
                    title={row.contributor_name}
                    tags={[meta.label]}
                    note={row.note}
                    addedBy={row.added_by}
                    date={row.date}
                    amount={row.amount}
                    amountPrefix="+ "
                    amountTone="text-emerald-200"
                    editable={isEditor}
                    onEdit={() => openEdit(row)}
                    onDelete={() => setPendingDelete(row)}
                  />
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {isEditor && (
        <CollectionForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          onSubmit={(payload) =>
            editing ? updateCollection(editing.id, payload) : addCollection(payload)
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete this collection?"
        message={
          pendingDelete
            ? `${pendingDelete.contributor_name}'s contribution will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
