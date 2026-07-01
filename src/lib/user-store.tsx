"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  landmark: string; // mapped from line2
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type UserOrder = {
  id: string;
  date: string;
  status: "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  total: string;
  items: { name: string; image: string; price: string; quantity: number }[];
};

type UserContextValue = {
  user: UserProfile | null;
  addresses: UserAddress[];
  orders: UserOrder[];
  isLoggedIn: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, "name" | "phone">>) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;

  addAddress: (address: Omit<UserAddress, "id">) => Promise<void>;
  updateAddress: (id: string, updates: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

function dbAddrToLocal(a: Record<string, unknown>): UserAddress {
  return {
    id: a.id as string,
    fullName: a.fullName as string,
    phone: a.phone as string,
    line1: a.line1 as string,
    landmark: (a.line2 as string) ?? "",
    city: a.city as string,
    state: a.state as string,
    pincode: a.pincode as string,
    country: (a.country as string) ?? "India",
    isDefault: a.isDefault as boolean,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [orders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // On mount — check if session cookie exists and load user + addresses
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data) {
          setUser({ ...data, createdAt: data.createdAt?.slice(0, 10) ?? "" });
          const addrRes = await fetch("/api/auth/addresses");
          const addrs = await addrRes.json();
          if (Array.isArray(addrs)) setAddresses(addrs.map(dbAddrToLocal));
        }
      } catch { /* offline or not logged in */ }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Login failed." };
    setUser({ ...data.user, createdAt: data.user.createdAt?.slice(0, 10) ?? "" });
    // load addresses
    const addrRes = await fetch("/api/auth/addresses");
    const addrs = await addrRes.json();
    if (Array.isArray(addrs)) setAddresses(addrs.map(dbAddrToLocal));
    return { ok: true };
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Registration failed." };
    setUser({ ...data.user, createdAt: data.user.createdAt?.slice(0, 10) ?? "" });
    setAddresses([]);
    return { ok: true };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAddresses([]);
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, "name" | "phone">>) => {
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (res.ok && data.user) setUser({ ...data.user, createdAt: data.user.createdAt?.slice(0, 10) ?? "" });
  };

  const changePassword = async (current: string, next: string) => {
    const res = await fetch("/api/auth/me/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Failed." };
    return { ok: true };
  };

  const addAddress = async (address: Omit<UserAddress, "id">) => {
    const res = await fetch("/api/auth/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const data = await res.json();
    if (res.ok && data.address) {
      const newAddr = dbAddrToLocal(data.address);
      setAddresses((prev) =>
        address.isDefault
          ? [...prev.map((a) => ({ ...a, isDefault: false })), newAddr]
          : [...prev, newAddr]
      );
    }
  };

  const updateAddress = async (id: string, updates: Partial<UserAddress>) => {
    const res = await fetch(`/api/auth/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (res.ok && data.address) {
      const updated = dbAddrToLocal(data.address);
      setAddresses((prev) =>
        updates.isDefault
          ? prev.map((a) => (a.id === id ? updated : { ...a, isDefault: false }))
          : prev.map((a) => (a.id === id ? updated : a))
      );
    }
  };

  const deleteAddress = async (id: string) => {
    await fetch(`/api/auth/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = async (id: string) => {
    await updateAddress(id, { isDefault: true } as Partial<UserAddress>);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        addresses,
        orders,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
