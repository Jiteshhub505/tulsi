"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { PopoverDemo } from "./components/Popup";
import SkeletonCard from "../components/Skeleton";

export type UserProfileProps = {
  name: string;
  email: string;
  image?: string | null;
  role: null | "admin" | "user";
  phone?: string | null;
  createdAt: string;
  lastLogin?: string | null;
};

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfileProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchUser = async () => {
    setLoading(true);
    try {
      const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
      const response = await axios.get("/api/userprofile/getuserdetails");
      if (response.data.user && response.data.user[0]) {
        const u = response.data.user[0];
        setUser({
          name: u.name ?? (savedPhone ? `User +91 ${savedPhone}` : "Guest User"),
          email: u.email ?? (savedPhone ? `+91 ${savedPhone}` : "guest@tulsiveda.com"),
          image: u.image ?? null,
          role: u.role || "user",
          phone: u.phone || savedPhone,
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleString() : new Date().toLocaleDateString(),
          lastLogin: new Date().toLocaleString(),
        });
      } else if (savedPhone) {
        setUser({
          name: `User +91 ${savedPhone}`,
          email: `+91 ${savedPhone}`,
          image: null,
          role: "user",
          phone: savedPhone,
          createdAt: new Date().toLocaleDateString(),
          lastLogin: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
      if (savedPhone) {
        setUser({
          name: `User +91 ${savedPhone}`,
          email: `+91 ${savedPhone}`,
          image: null,
          role: "user",
          phone: savedPhone,
          createdAt: new Date().toLocaleDateString(),
          lastLogin: new Date().toLocaleString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [status]);

  const addContact = () => {};
  if (loading) return <SkeletonCard />;
  return (
    <div className="w-full h-[90%] p-6">
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-xl font-semibold">
              {user?.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-1">
              {user?.role === "admin" ? "admin" : "user"}
            </Badge>
          </div>

          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="outline"
          >
            Logout
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 mt-4">
          {/* Contact */}
          <section className="space-y-2">
            <h3 className="font-semibold">Contact</h3>
            <div className="text-sm text-muted-foreground">
              {user?.phone ? (
                <div className="flex items-center gap-2">
                  <span>Phone:</span>
                  <span className="font-medium text-stone-900">+91 {user.phone.replace(/\D/g, "").slice(-10)}</span>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <span>No contact found:</span>
                  <PopoverDemo
                    //@ts-ignore
                    id={session?.user?.id}
                    setUser={setUser}
                    user={user}
                  />
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Addresses */}
          <section className="space-y-2">
            <h3 className="font-semibold">Addresses</h3>
            <p className="text-sm text-muted-foreground">
              Manage your saved delivery addresses
            </p>
            <Link href={"/profile/addresses"}>
              <Button variant={"outline"} size="sm">
                Manage Addresses
              </Button>
            </Link>
          </section>

          <Separator />

          {/* Account */}
          <section className="space-y-2">
            <h3 className="font-semibold">Account</h3>
            <p className="text-sm text-muted-foreground">
              Created: {user?.createdAt}
            </p>
            {user?.lastLogin && (
              <p className="text-sm text-muted-foreground">
                Last login: {user?.lastLogin}
              </p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
