"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateCategories } from "../../action/updateticket";
import { useState } from "react";
import { useRouter } from "next/navigation";
type ChatPopupProps = {
  ticketId: string;
};
function ChatPopup({ ticketId }: ChatPopupProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Mark as Completed
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              Are you sure you want to mark it as completed?
            </h4>
            <p className="text-muted-foreground text-sm">
              You cannot undo this action
            </p>
          </div>
          <div className="grid gap-2">
            <Button
              variant={"destructive"}
              onClick={() => {
                setOpen(false);
                updateCategories(`${ticketId}`, "completed");
                router.push("/admin-1234567-edtyufhjewdkj-5678/ticket");
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ChatPopup;
