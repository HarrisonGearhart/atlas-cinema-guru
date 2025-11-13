"use client";

import { useEffect, useState } from "react";
import { Star, StarOff, Clock } from "lucide-react";

// Define the structure for a watch-later movie
interface WatchLaterMovie {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  genres: string[];
  favorited: boolean;
  watchLater: boolean;
  image: string;
}

export default function WatchLaterPage() {
  // State for watch-later movies, pagination, and loading status
  const [movies, setMovies] = useState<WatchLaterMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch watch-later movies from the API
  // -----------------------------
  const fetchWatchLater = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/watch-later?page=${page}`);
      const data = await res.json();

      // Map API response to WatchLaterMovie structure
      const mappedMovies = (data.watchLater || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        synopsis: m.synopsis,
        releaseYear: m.released,
        genres: m.genre ? [m.genre] : [],
        favorited: m.favorited || false,
        watchLater: true, // All movies on this page are watch-later
        image: m.image || "/placeholder.jpg",
      }));

      setMovies(mappedMovies);
    } catch (err) {
      console.error("Failed to fetch watch-later:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch watch-later movies whenever the page changes
  useEffect(() => {
    fetchWatchLater();
  }, [page]);

  // -----------------------------
  // Toggle favorite status
  // -----------------------------
  const toggleFavorite = async (id: string, favorited: boolean) => {
    try {
      const method = favorited ? "DELETE" : "POST";
      await fetch(`/api/favorites/${id}`, { method });
      fetchWatchLater(); // Refresh list after update
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // -----------------------------
  // Remove movie from watch-later
  // -----------------------------
  const toggleWatchLater = async (id: string) => {
    try {
      await fetch(`/api/watch-later/${id}`, { method: "DELETE" });
      fetchWatchLater(); // Refresh list after removal
    } catch (err) {
      console.error("Failed to remove from watch-later:", err);
    }
  };

  // -----------------------------
  // Render the watch-later page
  // -----------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⏰ My Watch Later</h1>

      {loading ? (
        <p className="text-gray-400">Loading watch-later movies...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.length ? (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative group bg-[#0b0b4a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  {/* Movie Poster */}
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />

                  {/* Overlay info on hover */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                    <h2 className="text-lg font-bold">{movie.title}</h2>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {movie.synopsis}
                    </p>
                    <p className="text-sm mt-2 text-[#1ED2AF]">
                      {movie.releaseYear} • {(movie.genres || []).join(", ")}
                    </p>

                    {/* Favorite & Watch Later buttons */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => toggleFavorite(movie.id, movie.favorited)}
                        className="hover:scale-110 transition"
                      >
                        {movie.favorited ? (
                          <Star className="text-yellow-400" />
                        ) : (
                          <StarOff className="text-yellow-400" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleWatchLater(movie.id)}
                        className="hover:scale-110 transition"
                      >
                        <Clock className="text-blue-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full">
                No movies in Watch Later.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED2AF]/20 disabled:opacity-50"
            >
              ◀ Prev
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED2AF]/20"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
