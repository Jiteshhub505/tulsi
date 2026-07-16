"use client";

import AdminSidebar from "@/components/admin-sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await axios.post("/api/admin/login", {
        adminId,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
        toast.success("Welcome to TulsiVeda Admin Portal!");
      } else {
        setLoginError("Invalid ID or Password");
        toast.error("Access Denied: Invalid Credentials");
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.response?.data?.message || "Invalid ID or Password");
      toast.error("Access Denied: Invalid Credentials");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-700"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white border border-stone-200 p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">TulsiVeda Admin Portal</h2>
            <p className="mt-2 text-sm text-stone-500">Please enter your credentials to access the admin panel.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md shadow-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Admin ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm font-semibold text-center mt-2">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl transition shadow-md cursor-pointer text-sm"
            >
              ACCESS PORTAL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <Toaster position="top-right" />
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
