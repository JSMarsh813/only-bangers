"use client";

//https://www.youtube.com/watch?v=XcUpTPbY4Wg

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getQueryClient } from "./GetQueryClient";

export default function Provders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  // console.log("this is in queryProvider");

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
