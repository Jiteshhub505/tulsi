"use client";

import Footer from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import SiteInitialLoader from "@/components/landing/SiteInitialLoader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes cache
            gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SiteInitialLoader />
      <Header />
      {children}
      <Footer />
    </QueryClientProvider>
  );
}
