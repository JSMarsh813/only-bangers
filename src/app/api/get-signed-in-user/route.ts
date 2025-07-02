import getSignedInUser from "@/lib/getSignedInUser";
import { NextResponse } from "next/server";

//To call this code on the client, the api was a necessary workaround
// getSignedInUser can't be directly called on the client because cookies headers is server only api
//but if a client component uses an api as a middleman, we can now use getSignedInUser
export async function GET() {
  const user = await getSignedInUser();
  return NextResponse.json({ user });
}
