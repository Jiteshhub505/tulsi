"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { LayoutDashboard, Menu, Receipt, ShoppingBag, Store, Ticket, X, LogOut, Smartphone, type LucideIcon } from "lucide-react";

type NavItem = { title: string; href: string; icon: LucideIcon };

const prefix = "/admin-1234567-edtyufhjewdkj-5678";

const items: NavItem[] = [
  { title: "Dashboard", href: `${prefix}`, icon: LayoutDashboard },
  { title: "Add Product", href: `${prefix}/addproduct`, icon: ShoppingBag },
  { title: "Inventory", href: `${prefix}/inventory`, icon: Store },
  { title: "Coupons", href: `${prefix}/coupons`, icon: Ticket },
  { title: "Orders", href: `${prefix}/orders`, icon: Receipt },
  { title: "Numbers", href: `${prefix}/numbers`, icon: Smartphone },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="px-3 py-4 space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
              active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

const AdminSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex md:hidden items-center justify-between h-16 px-4 border-b bg-white">
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
        <Logo className="h-7" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <aside className="w-64 h-full bg-white border-r flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <Logo className="h-7" />
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => {
                  localStorage.removeItem("admin_auth");
                  window.location.reload();
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition text-red-650 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden md:flex w-64 h-screen border-r bg-white flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-4 border-b">
            <Link href="/">
              <Logo className="h-7" />
            </Link>
          </div>
          <NavLinks pathname={pathname} />
        </div>
        <div className="p-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              window.location.reload();
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition text-red-650 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
