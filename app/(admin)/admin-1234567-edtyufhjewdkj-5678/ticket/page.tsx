"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type Tickets = {
  id: string;
  userId: string;
  subject: string;
  status: "pending" | "open" | "completed" | "replied";
  createdAt: string;
}[];

export default function TicketsTable() {
  ////////////////////CONSTS/////////////////////////////
  const [tickets, setTickets] = useState<Tickets>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending"); // ADD THIS
  const option = ["pending", "open", "completed", "replied"];

  ////////////////////FUNCTIONS/////////////////////////////
  useEffect(() => {
    fetchTicketsByCategories("pending");
  }, []);

  const fetchTicketsByCategories = async (c: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/tickets/fetchtickets/?status=${c}`
      );
      setTickets(response.data.result || []);
      setSelectedStatus(c);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////rendering/////////////////////////////
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>
            Status{" "}
            <select
              name="status"
              value={selectedStatus}
              onChange={(e) => fetchTicketsByCategories(e.target.value)}
              className="ml-2 border rounded px-2 py-1"
            >
              {option.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tickets.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No {selectedStatus} tickets found
            </TableCell>
          </TableRow>
        ) : (
          tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin-1234567-edtyufhjewdkj-5678/ticket/chats/${ticket.id}`}
                  className="hover:underline cursor-pointer"
                >
                  {ticket.subject}
                </Link>
              </TableCell>

              <TableCell>
                <Badge variant="secondary">{ticket.status}</Badge>
              </TableCell>

              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
