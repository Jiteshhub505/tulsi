"use client";
import SkeletonCard from "@/app/(profile)/profile/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatPopup from "../components/ChatPopup";
import { updateCategories } from "../../action/updateticket";

type Chat = {
  id: string;
  content: string;
  createdAt: string;
  role: string;
  userEmail: string;
};

export default function Page() {
  ////////VARS///////////////////////////
  const [chats, setChats] = useState<Chat[]>([]);
  const [content, setContent] = useState("");
  const [btnLoading, setBtnLoading] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const ticketId = params.id as string;

  ////////FUNCTIONS///////////////////////////
  const fetchAllChats = async () => {
    //getting all chats
    setLoading(true);
    const { data } = await axios.get(
      `/api/userprofile/chats?ticketId=${ticketId}`,
    );
    setChats(data.chats);
    setLoading(false);

    //updating status to = "open"
    const response = await axios.put(
      `/api/admin/tickets/update/categories/?status=open&ticketId=${ticketId}`,
    );
  };

  //TO BE UPDATED
  const sendMail = async (content: any) => {
    setChats((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content,
        createdAt: new Date().toISOString(),
        role: "admin",
        userEmail: "tulsiveda@admin.com",
      },
    ]);

    setBtnLoading(true);
    const response = await axios.post("/api/email/send/auth", {
      ticketId,
      userEmail: chats[0].userEmail,
      content,
      role: "admin",
    });
    setBtnLoading(false);
    setContent("");
    updateCategories(`${ticketId}`, "replied");
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  ////////RENDERING///////////////////////////
  if (loading) return <SkeletonCard />;
  return (
    <div className="flex flex-col h-[90%]">
      {/* Ticket timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((c) => (
          <div
            key={c.id}
            className={`rounded-md border p-4 text-sm ${
              c.role === "user"
                ? "bg-gray-50 border-gray-200"
                : "bg-white border-blue-200"
            }`}
          >
            {/* Header */}
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
              <span>{c.role === "user" ? "Customer" : "Admin Reply"}</span>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>

            {/* Content */}
            <div className="text-gray-800 whitespace-pre-wrap">{c.content}</div>
          </div>
        ))}
      </div>

      {/* Reply box */}
      <div className="border-t p-4 bg-gray-50">
        <div className="mb-2 text-xs text-gray-500">
          Reply to customer (email will be sent)
        </div>

        <div className="flex gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1"
          />
          <Button
            className="w-28"
            onClick={() => sendMail(content)}
            disabled={btnLoading}
          >
            {btnLoading ? <Loader className="animate-spin" /> : "Reply"}
          </Button>

          <ChatPopup ticketId={ticketId} />
        </div>
      </div>
    </div>
  );
}
