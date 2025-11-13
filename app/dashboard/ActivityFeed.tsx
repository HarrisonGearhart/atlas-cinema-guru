// app/dashboard/ActivityFeed.tsx
export default async function ActivityFeed() {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/activities`, {
        cache: "no-store",
      });
  
      if (!res.ok) throw new Error("Failed to fetch activities");
  
      const data = await res.json();
  
      return (
        <div className="mt-auto mb-4 w-full hidden group-hover:block px-4">
          <h3 className="text-sm font-semibold mb-2 text-[#1ED2AF]">
            Recent Activity
          </h3>
          <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
            {data?.activities?.length ? (
              data.activities.map((activity: any, i: number) => (
                <li
                  key={i}
                  className="bg-[#1ED2AF]/10 px-2 py-1 rounded-md truncate"
                >
                  {activity.description}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No recent activity</li>
            )}
          </ul>
        </div>
      );
    } catch {
      return (
        <div className="mt-auto mb-4 w-full hidden group-hover:block px-4">
          <p className="text-xs text-gray-400">Failed to load activity feed</p>
        </div>
      );
    }
  }
  