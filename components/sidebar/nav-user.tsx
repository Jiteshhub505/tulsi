"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, status } = useSession();
  const [phoneUser, setPhoneUser] = useState<string | null>(null);
  const [coins, setCoins] = useState<number>(0);

  useEffect(() => {
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
    if (savedPhone) {
      setPhoneUser(savedPhone);
      const rawWallet = localStorage.getItem("tulsi_wallet");
      if (rawWallet) {
        try {
          const parsed = JSON.parse(rawWallet);
          setCoins(parsed.balance || 0);
        } catch {}
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tulsi_user_phone");
    localStorage.removeItem("tulsi_wallet");
    window.dispatchEvent(new CustomEvent("wallet-updated", { detail: null }));
    if (session) {
      signOut({ callbackUrl: "/" });
    } else {
      window.location.href = "/";
    }
  };

  const displayName = phoneUser ? `+91 ${phoneUser.slice(-10)}` : (session?.user?.name || "Customer");
  const displaySubtitle = phoneUser ? `🪙 ${coins} Tulsi Coins` : (session?.user?.email || "TulsiVeda Member");
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <AvatarFallback>{displayName.charAt(displayName.startsWith("+") ? 4 : 0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-stone-900">{displayName}</span>
                <span className="text-emerald-700 truncate text-xs font-semibold">
                  {displaySubtitle}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <AvatarFallback>{displayName.charAt(displayName.startsWith("+") ? 4 : 0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-stone-900">{displayName}</span>
                  <span className="text-emerald-700 truncate text-xs font-semibold">
                    {displaySubtitle}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Button
                onClick={handleLogout}
                className="cursor-pointer w-full justify-start gap-2"
                variant={"outline"}
              >
                <IconLogout className="size-4 text-red-600" />
                <span>Log out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavUser;
