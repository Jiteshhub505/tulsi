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
            staleTime: 10 * 1000, // 10 seconds fresh window
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
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
