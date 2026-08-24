"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/language-context";
import GtmPageView from "@/components/analytics/GtmPageView";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <GtmPageView />
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}

