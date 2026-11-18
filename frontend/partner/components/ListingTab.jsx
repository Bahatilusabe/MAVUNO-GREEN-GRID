import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Store } from "lucide-react";
import { fmt } from "../../shared/utils";
import Button from "../../shared/ui/Button";
import Field from "../../shared/ui/Field";
import { Card, CardHeader, CardTitle, CardBody } from "../../shared/ui/Card";

export default function ListingTab({ listing, load, onSave, saving }) {
  const [draft, setDraft] = useState({
    price: String(listing.price ?? ""),
    capacity: String(listing.capacity ?? ""),
  });
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");


  // Keep the form in step with the server when the listing is reloaded.
  useEffect(() => {
    setDraft({
      price: String(listing.price ?? ""),
      capacity: String(listing.capacity ?? ""),
    });
  }, [listing.price, listing.capacity]);


  const price = Number(draft.price);
  const cap = Number(draft.capacity);

  const error = !(price > 0)
    ? "Enter a price above 0."
    : !(cap > 0)
      ? "Enter a capacity above 0."
      : cap < load
        ? `Capacity can't go below current load (${fmt(load)} kg).`
        : "";


  const edit = (k) => (e) => {
    setServerError("");
    setDraft({ ...draft, [k]: e.target.value });

  const edit = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  const submit = async () => {
    if (error) return;
    try {
      await onSave(price, cap);
      toast.success("Listing saved");
    } catch (e) {
      toast.error(e.message || "Could not save the listing");
    }

  };

  const save = async () => {
    setSaving(true);
    setServerError("");
    try {
      await onSave(price, cap);
      toast.success("Listing saved");
    } catch (e) {
      setServerError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const shownError = error || serverError;
  const disabled = Boolean(error) || saving;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <Store size={18} />
          </span>
          <div>
            <CardTitle>Your Listing</CardTitle>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              What farmers see when they look for a buyer
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-5">
        <Field
          label="Price offered (KES/kg)"
          type="number"
          min="1"
          value={draft.price}
          onChange={edit("price")}
          suffix="KES"
          inputMode="decimal"
        />


        {/* Capacity Input */}
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Daily capacity (kg)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={draft.capacity}
            onChange={edit("capacity")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-green-600 transition-all font-medium"
          />
        </label>
      </div>

      {shownError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700" role="alert">
          {shownError}
        </div>
      )}

      <button
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800 text-white cursor-pointer"
        }`}
        disabled={disabled}
        onClick={save}
      >
        {saving ? "Saving..." : "Save listing"}
      </button>

      <div className="text-center pt-1">
        <small className="text-[11px] text-gray-400 font-medium">
          The price is the opening offer farmers see when they send you a request.
        </small>
      </div>
    </section>

        <Field
          label="Daily capacity (kg)"
          type="number"
          min="1"
          value={draft.capacity}
          onChange={edit("capacity")}
          suffix="kg"
          inputMode="numeric"
          hint={load ? `${fmt(load)} kg already committed` : "No committed load yet"}
          error={error || undefined}
        />

        <Button className="w-full" onClick={submit} loading={saving} disabled={Boolean(error)}>
          Save listing
        </Button>

        <p className="text-center text-[11px] font-medium text-muted-foreground">
          Changes apply to farmers as soon as they are saved.
        </p>
      </CardBody>
    </Card>

  );
}
