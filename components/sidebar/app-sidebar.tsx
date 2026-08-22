"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import NavUser from "./nav-user";
import { useSession } from "next-auth/react";

export function AppSidebar() {
  const [active, setActive] = useState<string>("orders");
  const { data: session, status } = useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href={"/"}>
            <Button className="cursor-pointer">
              <ArrowLeft />
            </Button>
          </Link>
          <h2 className="font-semibold">Home</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link href={"/profile/orders"}>
            <Button variant={"secondary"} className="w-full cursor-pointer font-bold justify-start">
              My orders
            </Button>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
