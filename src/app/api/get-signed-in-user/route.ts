import getUser from "@/lib/getUser";
import { NextResponse } from "next/server";

//To call this code on the client, the api was a necessary workaround
// getUser can't be directly called on the client because cookies headers is server only api
//but if a client component uses an api as a middleman, we can now use getUser
export async function GET() {
  const user = await getUser();
  return NextResponse.json({ user });
}
