"use client";

import { useEffect, useState } from "react";
import { Star, Clock } from "lucide-react";

// Define the structure for a favorite movie
interface FavoriteMovie {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  genres: string[];
  favorited: boolean;
  watchLater: boolean;
  image: string;
}

export default function FavoritesPage() {
  // State for favorite movies, pagination, and loading status
  const [movies, setMovies] = useState<FavoriteMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch favorites from the API
  // -----------------------------
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?page=${page}`);
      const data = await res.json();

      // Map API response to our FavoriteMovie structure
      const mappedMovies = (data.favorites || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        synopsis: m.synopsis,
        releaseYear: m.released,
        genres: m.genre ? [m.genre] : [],
        favorited: true, // All movies on this page are favorites
        watchLater: m.watchLater || false,
        image: m.image || "/placeholder.jpg",
      }));

      setMovies(mappedMovies);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites whenever the page changes
  useEffect(() => {
    fetchFavorites();
  }, [page]);

  // -----------------------------
  // Remove movie from favorites
  // -----------------------------
  const toggleFavorite = async (id: string) => {
    try {
      await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      fetchFavorites(); // Refresh list after removal
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  // -----------------------------
  // Toggle "watch later" status
  // -----------------------------
  const toggleWatchLater = async (id: string, watchLater: boolean) => {
    try {
      await fetch(`/api/watch-later/${id}`, {
        method: watchLater ? "DELETE" : "POST",
      });
      fetchFavorites(); // Refresh list after update
    } catch (err) {
      console.error("Failed to toggle watch later:", err);
    }
  };

  // -----------------------------
  // Render the favorites page
  // -----------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl text-center font-bold mb-6">Favorites</h1>

      {loading ? (
        <p className="text-gray-400">Loading favorites...</p>
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
                        onClick={() => toggleFavorite(movie.id)}
                        className="hover:scale-110 transition"
                      >
                        <Star className="text-yellow-400" />
                      </button>
                      <button
                        onClick={() =>
                          toggleWatchLater(movie.id, movie.watchLater)
                        }
                        className="hover:scale-110 transition"
                      >
                        <Clock
                          className={`${
                            movie.watchLater ? "text-blue-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full">
                No favorites found.
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
