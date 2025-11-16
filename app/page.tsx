import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Assistant } from "./assistant";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <Assistant />;
}
