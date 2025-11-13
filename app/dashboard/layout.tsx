// app/dashboard/layout.tsx
import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import ActivityFeed from "./ActivityFeed";
import { redirect } from "next/navigation";

// Lucide Icons
import { Home, Star, Clock, Activity } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect if not logged in
  if (!session) {
    redirect("/api/auth/signin");
  }

  const user = session.user;

  return (
    <div className="flex h-screen bg-[#00003c] text-white">
      {/* Sidebar */}
      <aside className="group relative w-16 hover:w-64 transition-all duration-300 bg-[#0b0b4a] flex flex-col items-center overflow-hidden">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2 w-full">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="hidden group-hover:inline text-lg font-semibold">
            Cinema Guru
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 mt-8 w-full">
          <Link
            href="/dashboard"
            className="px-4 py-2 hover:bg-[#1ED2AF]/20 transition rounded-md text-sm flex items-center gap-2"
          >
            <Home size={16} />
            <span className="hidden group-hover:inline ml-2">Home</span>
          </Link>

          <Link
            href="/dashboard/favorites"
            className="px-4 py-2 hover:bg-[#1ED2AF]/20 transition rounded-md text-sm flex items-center gap-2"
          >
            <Star size={16} />
            <span className="hidden group-hover:inline ml-2">Favorites</span>
          </Link>

          <Link
            href="/dashboard/watch-later"
            className="px-4 py-2 hover:bg-[#1ED2AF]/20 transition rounded-md text-sm flex items-center gap-2"
          >
            <Clock size={16} />
            <span className="hidden group-hover:inline ml-2">Watch Later</span>
          </Link>

          <Link
            href="/dashboard/activities"
            className="px-4 py-2 hover:bg-[#1ED2AF]/20 transition rounded-md text-sm flex items-center gap-2"
          >
            <Activity size={16} />
            <span className="hidden group-hover:inline ml-2">Activity</span>
          </Link>
        </nav>

        {/* Activity Feed */}
        <ActivityFeed />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-[#0b0b4a] shadow-md">
          <h1 className="text-lg font-semibold">Welcome, {user?.email}</h1>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="bg-[#1ED2AF] text-black px-4 py-2 rounded-md hover:opacity-90 transition" type="submit">
              Sign Out
            </button>
          </form>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
