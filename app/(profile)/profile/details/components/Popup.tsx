import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useState } from "react";
import { UserProfileProps } from "../page";
import { LoaderCircle } from "lucide-react";
import { trackUserVerified } from "@/lib/gtm";

type Props = {
  id: string;
  setUser: React.Dispatch<React.SetStateAction<UserProfileProps | null>>;
  user: UserProfileProps | null;
};

export function PopoverDemo({ id, setUser, user }: Props) {
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const savePhone = async () => {
    setLoading(true);
    if (phone.length == 10) {
      setError("");
      const response = await axios.put("/api/userprofile/savephone", {
        phone,
        id,
      });

      if (response.data.success) {
        setUser((prev) => (prev ? { ...prev, phone } : prev));
        trackUserVerified(id || phone);
        setLoading(false);
      }
    } else {
      setError("Phone number must be valid (10 digits)");
      setLoading(false);
      return;
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Add</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Add your phone number</h4>
            <p className="text-muted-foreground text-sm">
              Phone number will help us deliver fast.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-1">
              <Input
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
                placeholder="892xxxxx"
                className="w-full col-span-2 h-8"
              />
            </div>
          </div>
          <Button onClick={savePhone} variant={"default"}>
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <span>Save</span>
            )}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
