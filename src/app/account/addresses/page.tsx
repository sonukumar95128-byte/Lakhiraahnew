"use client";

import { useState } from "react";
import { useUser, type UserAddress } from "@/lib/user-store";

const emptyForm = {
  fullName: "", phone: "", line1: "", landmark: "",
  city: "", state: "", pincode: "", country: "India", isDefault: false,
};

const states = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<UserAddress, "id">>(emptyForm);

  const set = (k: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (addr: UserAddress) => { setForm({ ...addr }); setEditId(addr.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditId(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateAddress(editId, form);
    } else {
      await addAddress(form);
    }
    cancel();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading italic text-3xl text-brand">Addresses</h1>
        {!showForm && (
          <button
            onClick={openAdd}
            className="rounded-full border border-brand px-4 py-2 text-xs font-medium text-brand hover:bg-brand hover:text-gold-light transition-colors"
          >
            + Add address
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gold/40 p-6">
          <h2 className="text-sm font-medium text-brand mb-4">{editId ? "Edit address" : "New address"}</h2>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Full name</label>
                <input value={form.fullName} onChange={set("fullName")} required placeholder="Priya Sharma"
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Mobile number</label>
                <input value={form.phone} onChange={set("phone")} required placeholder="9876543210"
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Address (house no., street, area)</label>
                <input value={form.line1} onChange={set("line1")} required placeholder="123, MG Road, Koramangala"
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Nearby landmark (optional)</label>
                <input value={form.landmark} onChange={set("landmark")} placeholder="Near City Mall"
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">City</label>
                <input value={form.city} onChange={set("city")} required placeholder="Bengaluru"
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Pincode</label>
                <input value={form.pincode} onChange={set("pincode")} required placeholder="560001" maxLength={6}
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">State</label>
                <select value={form.state} onChange={set("state")} required
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="">Select state</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Country</label>
                <input value={form.country} onChange={set("country")} required
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={set("isDefault")} className="accent-gold" />
              Set as default address
            </label>
            <div className="flex gap-3 pt-1">
              <button type="submit" className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors">
                {editId ? "Save changes" : "Add address"}
              </button>
              <button type="button" onClick={cancel} className="rounded-full border border-beige px-6 py-2.5 text-sm text-ink/60 hover:border-gold transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-beige p-12 text-center">
          <p className="text-3xl mb-2">📍</p>
          <p className="text-sm text-ink/50 mb-4">No saved addresses yet</p>
          <button onClick={openAdd} className="inline-block rounded-full bg-brand px-5 py-2 text-xs font-medium text-gold-light hover:bg-brand-secondary transition-colors">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-2xl border p-5 relative ${addr.isDefault ? "border-gold" : "border-beige"}`}>
              {addr.isDefault && (
                <span className="absolute top-3 right-3 rounded-full bg-gold/10 text-gold text-xs px-2 py-0.5 font-medium">Default</span>
              )}
              <p className="text-sm font-medium text-brand mb-0.5">{addr.fullName}</p>
              <p className="text-xs text-ink/60">{addr.phone}</p>
              <p className="text-xs text-ink/70 mt-2">{addr.line1}{addr.landmark ? `, near ${addr.landmark}` : ""}</p>
              <p className="text-xs text-ink/70">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-xs text-ink/70">{addr.country}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => openEdit(addr)} className="text-xs text-gold hover:text-brand transition-colors">Edit</button>
                {!addr.isDefault && (
                  <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-ink/50 hover:text-brand transition-colors">Set default</button>
                )}
                <button onClick={() => deleteAddress(addr.id)} className="text-xs text-red-400 hover:text-red-600 ml-auto transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
