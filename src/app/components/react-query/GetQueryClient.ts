import { QueryClient, isServer } from "@tanstack/react-query";

//https://www.youtube.com/watch?v=XcUpTPbY4Wg
function makeQueryClient() {
  const query = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  return query;
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // console.log("getQueryClient function entered");
  if (isServer) {
    // console.log("is server was true");
    return makeQueryClient();
  } else {
    // console.log("is server was false");
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}
