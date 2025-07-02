import { NextResponse } from "next/server";
import { deleteSession } from "@/server-actions/auth";

export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true });
}

// Why I kept delete session as a server function, instead of writing it in this api route:

// I want to reuse the logic in multiple places.
// I want to keep your API routes clean and focused on request/response handling

// Why you would decide to put the logic in here:

// The logic is very simple and only used in that one place
// You want to avoid an extra function call for a one-liner
