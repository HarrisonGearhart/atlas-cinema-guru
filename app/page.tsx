// app/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If not authenticated, go to sign-in
  if (!session) {
    redirect("/api/auth/signin");
  }

  // If authenticated, redirect to dashboard
  redirect("/dashboard");
}
