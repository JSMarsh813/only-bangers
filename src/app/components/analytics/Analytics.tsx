// app/components/Analytics.tsx
"use client";

// Because the App Router uses client-side navigation, GA won’t automatically see “page views”
// so I'm going to send updates when the route changes with a client component

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as gtag from "@/lib/analytics/gtag";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = pathname + searchParams.toString();

    gtag.pageview(url);
  }, [pathname, searchParams]);

  return null;
}
