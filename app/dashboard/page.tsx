import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Check if the user is authenticated
  const session = await auth();

  // If not logged in, redirect to GitHub sign-in
  if (!session) {
    redirect("/api/auth/signin");
  }

  // If logged in, render the dashboard home content
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4">
        Hello, {session.user?.name || "Cinema Guru"} 👋
      </h1>
      <p className="text-gray-300">
        Welcome to your dashboard! Use the sidebar to navigate between Favorites, Watch Later, and Activity.
      </p>
    </div>
  );
}
