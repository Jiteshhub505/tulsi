"use client";

import Footer from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import SiteInitialLoader from "@/components/landing/SiteInitialLoader";
import GlobalProductImagePreloader from "@/components/landing/GlobalProductImagePreloader";
import FloatingSpinToWin from "@/components/rewards/FloatingSpinToWin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes fresh in-memory
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SiteInitialLoader />
      <GlobalProductImagePreloader />
      <Header />
      {children}
      <FloatingSpinToWin />
      <Footer />
    </QueryClientProvider>
  );
}
