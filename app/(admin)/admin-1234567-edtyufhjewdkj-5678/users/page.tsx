"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Shield,
  ShieldAlert,
  CheckCircle2,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  phone?: string;
  createdAt?: string;
  emailVerified: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users/get_all");

        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("API Error:", response.data.message);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const deleteUser = async (id: string) => {
    const response = await axios.delete("/api/admin/users/deleteuser", {
      data: { userId: id },
    });

    if (response.data.success) {
      window.location.reload();
    } else {
      alert(response.data.error);
    }
  };
  return (
    <div className="p-6">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your users and view their verification status.
              </CardDescription>
            </div>
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>User Details</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading State */}
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      {/* Avatar Column */}
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      {/* Name & Email Column */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              📞 {user.phone}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Role Column */}
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {user.role === "admin" ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : (
                            <UserIcon className="w-3 h-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>

                      {/* Verification Status Column */}
                      <TableCell>
                        {user.emailVerified ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                            <ShieldAlert className="w-4 h-4" />
                            Unverified
                          </div>
                        )}
                      </TableCell>

                      {/* Date Column */}
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      {/* Actions Menu */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(user.id)
                              }
                              className="cursor-pointer"
                            >
                              Copy User ID
                            </DropdownMenuItem>
                            <Link
                              href={`/admin-1234567-edtyufhjewdkj-5678/orders/userspecific?userId=${user.id}&orderId=*`}
                            >
                              <DropdownMenuItem className="cursor-pointer">
                                View Transactions
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
