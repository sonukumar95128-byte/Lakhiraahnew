"use client";

import { useState } from "react";
import { useUser } from "@/lib/user-store";

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useUser();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, phone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    const result = await changePassword(currentPw, newPw);
    if (result.ok) {
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 3000);
    } else {
      setPwError(result.error ?? "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading italic text-3xl text-brand">Profile</h1>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-beige p-6">
        <h2 className="text-sm font-medium text-brand mb-4">Personal information</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Email address</label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm bg-beige/30 text-ink/50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Mobile number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Member since</label>
              <input
                value={user?.createdAt ?? ""}
                disabled
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm bg-beige/30 text-ink/50 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
            >
              Save changes
            </button>
            {profileSaved && <p className="text-sm text-green-600">✓ Saved successfully</p>}
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-beige p-6">
        <h2 className="text-sm font-medium text-brand mb-4">Change password</h2>
        {pwError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {pwError}
          </div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink/60 mb-1.5">Current password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40 hover:text-ink/70">
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">New password</label>
              <input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1.5">Confirm new password</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-lg border border-beige px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
            >
              Update password
            </button>
            {pwSaved && <p className="text-sm text-green-600">✓ Password updated</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
