"use client";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Display() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const params = useSearchParams();
  let path = params.get("path");
  if (!path) path = "/";

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={async (e) => {
          setLoading(true);
          e.preventDefault();
          await signIn("email", {
            email,
            callbackUrl: "/auth/getstarted/details",
            redirect: false,
          });
        }}
        action=""
        className="max-w-92 m-auto h-fit w-full"
      >
        <div className="p-6">
          <div>
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create account in Tulsiveda
            </h1>
            <p>Welcome! Create an account to get started</p>
          </div>

          {/* Email Login Form Directly */}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                name="email"
                id="email"
              />
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="cursor-pointer w-full"
            >
              {loading ? "Please Check your mail" : "Continue"}
            </Button>
            {loading ? (
              <Button
                className="w-full"
                variant={"outline"}
                onClick={() => setLoading(false)}
              >
                click here to resend
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
