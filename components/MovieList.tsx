"use client";

import { useEffect, useState } from "react";
import { Star, StarOff, Clock } from "lucide-react";

// Define the structure of Movie object
interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  genre: string;
  favorited: boolean;
  watchLater: boolean;
  image: string;
}

export default function MovieList() {
  // State for storing movies, current page, and loading status
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch movies from the API
  // -----------------------------
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/titles?page=${page}`);
      const data = await res.json();

      // Map API response to Movie objects
      setMovies(
        data?.titles.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.synopsis,
          year: m.released,
          genre: m.genre,
          favorited: m.favorited,
          watchLater: m.watchLater,
          image: m.image || `/images/${m.id}.webp`,
        })) || []
      );
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies whenever page changes
  useEffect(() => {
    fetchMovies();
  }, [page]);

  // -----------------------------
  // Toggle favorite status
  // -----------------------------
  const toggleFavorite = async (movieId: string, favorited: boolean) => {
    try {
      await fetch(`/api/favorites/${movieId}`, {
        method: favorited ? "DELETE" : "POST",
      });
      fetchMovies(); // Refresh movies after update
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // -----------------------------
  // Toggle watch later status
  // -----------------------------
  const toggleWatchLater = async (movieId: string, watchLater: boolean) => {
    try {
      await fetch(`/api/watch-later/${movieId}`, {
        method: watchLater ? "DELETE" : "POST",
      });
      fetchMovies(); // Refresh movies after update
    } catch (err) {
      console.error("Failed to toggle watch later:", err);
    }
  };

  // -----------------------------
  // Render UI
  // -----------------------------
  return (
    <div>
      {loading ? (
        <p className="text-gray-400">Loading movies...</p>
      ) : movies.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative group rounded overflow-hidden bg-[#1b1b4c]"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />

              {/* Overlay shown on hover */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-4">
                <div>
                  <h3 className="text-white font-bold">{movie.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                  <p className="text-gray-400 text-xs">{movie.year} | {movie.genre}</p>
                </div>
                {/* Favorite & Watch Later buttons */}
                <div className="flex gap-2">
                  <button onClick={() => toggleFavorite(movie.id, movie.favorited)}>
                    {movie.favorited ? (
                      <Star className="text-yellow-400" />
                    ) : (
                      <StarOff className="text-yellow-400" />
                    )}
                  </button>
                  <button onClick={() => toggleWatchLater(movie.id, movie.watchLater)}>
                    <Clock className={movie.watchLater ? "text-blue-400" : "text-gray-300"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No movies found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
          className="px-4 py-2 bg-[#1ED2AF] text-black rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-[#1ED2AF] text-black rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
