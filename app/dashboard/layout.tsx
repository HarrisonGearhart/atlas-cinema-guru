import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import ActivityFeed from "../../components/ActivityFeed";
import { redirect } from "next/navigation";
import { Home, Star, Clock } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/api/auth/signin");




  const user = session.user;

  return (
    <div className="flex h-screen bg-[#00003c] text-white">
      {/* Sidebar */}
      <aside className="group relative w-16 hover:w-64 transition-all duration-300 bg-[#1ED5AF] flex flex-col items-center overflow-hidden text-black">
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
            className="px-4 py-2 hover:bg-[#14a287] transition rounded-md text-sm flex items-center gap-2"
          >
            <Home size={16} />
            <span className="hidden group-hover:inline ml-2">Home</span>
          </Link>

          <Link
            href="/dashboard/favorites"
            className="px-4 py-2 hover:bg-[#14a287] transition rounded-md text-sm flex items-center gap-2"
          >
            <Star size={16} />
            <span className="hidden group-hover:inline ml-2">Favorites</span>
          </Link>

          <Link
            href="/dashboard/watch-later"
            className="px-4 py-2 hover:bg-[#14a287] transition rounded-md text-sm flex items-center gap-2"
          >
            <Clock size={16} />
            <span className="hidden group-hover:inline ml-2">Watch Later</span>
          </Link>
        </nav>

        {/* Activity Feed */}
        <div className="mt-auto w-full border-t border-black/10">
          <ActivityFeed />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-[#00003c]">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-[#1ED5AF] shadow-md">
          <h1 className="text-lg font-semibold text-white">
            Welcome, {user?.email}
          </h1>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="bg-[#1ED5AF] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
            >
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