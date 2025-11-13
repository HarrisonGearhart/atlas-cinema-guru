"use client";

import { useEffect, useState } from "react";
import { Star, StarOff, Clock } from "lucide-react";

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

export default function DashboardPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const genreOptions = ["Action", "Drama", "Comedy", "Sci-Fi", "Romance", "Horror"];

  // Fetch movies from API
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(minYear && { minYear }),
        ...(maxYear && { maxYear }),
        ...(genres.length && { genres: genres.join(",") }),
      });

      const res = await fetch(`/api/titles?${query.toString()}`);
      const data = await res.json();

      setMovies(
        data?.title.map((m: any) => ({
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

  useEffect(() => {
    fetchMovies();
  }, [page, search, minYear, maxYear, genres]);

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };


  const toggleFavorite = async (movieId: string, favorited: boolean) => {
    try {
      await fetch(`/api/favorites/${movieId}`, {
        method: favorited ? "DELETE" : "POST",
      });
      fetchMovies();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };


  const toggleWatchLater = async (movieId: string, watchLater: boolean) => {
    try {
      await fetch(`/api/watch-later/${movieId}`, {
        method: watchLater ? "DELETE" : "POST",
      });
      fetchMovies();
    } catch (err) {
      console.error("Failed to toggle watch later:", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#1ED5AF]">🎬 Movie Explorer</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-xl w-full bg-transparent border-2 border-[#1ED5AF] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1ED5AF]"
        />
        <input
          type="number"
          placeholder="Min Year"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
          className="p-3 rounded-xl w-full bg-transparent border-2 border-[#1ED5AF] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1ED5AF]"
        />
        <input
          type="number"
          placeholder="Max Year"
          value={maxYear}
          onChange={(e) => setMaxYear(e.target.value)}
          className="p-3 rounded-xl w-full bg-transparent border-2 border-[#1ED5AF] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1ED5AF]"
        />
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genreOptions.map((g) => (
          <button
            key={g}
            onClick={() => toggleGenre(g)}
            className={`px-4 py-2 rounded-full text-sm border transition-all ${
              genres.includes(g)
                ? "bg-[#1ED5AF] text-black border-[#1ED5AF]"
                : "border-[#1ED5AF] text-[#1ED5AF] hover:bg-[#1ED5AF]/10"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      {loading ? (
        <p className="text-gray-400">Loading movies...</p>
      ) : movies.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative group bg-[#0b0b4a] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                <h2 className="text-lg font-bold text-[#1ED5AF]">{movie.title}</h2>
                <p className="text-xs text-gray-200 line-clamp-2">{movie.description}</p>
                <p className="text-sm mt-2 text-[#1ED5AF]">
                  {movie.year} • {movie.genre}
                </p>

                {/* Favorite & Watch Later */}
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
                    onClick={() => toggleWatchLater(movie.id, movie.watchLater)}
                    className="hover:scale-110 transition"
                  >
                    <Clock
                      className={`${
                        movie.watchLater ? "text-[#1ED5AF]" : "text-gray-300"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No movies found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED5AF]/20 disabled:opacity-50 transition"
        >
          ◀ Prev
        </button>
        <span className="text-sm text-[#1ED5AF]">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-[#0b0b4a] rounded-md hover:bg-[#1ED5AF]/20 transition"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}