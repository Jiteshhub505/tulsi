"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { trackPageView } from "@/lib/gtm";

function GtmPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = searchParams?.toString();
      const fullPath = search ? `${pathname}?${search}` : pathname;
      const fullUrl = `${window.location.origin}${fullPath}`;
      trackPageView(fullUrl, fullPath, document.title);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GtmPageView() {
  return (
    <Suspense fallback={null}>
      <GtmPageViewTracker />
    </Suspense>
  );
}
