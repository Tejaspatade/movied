import { useState, useEffect } from "react";
import React from "react";

import { NavBar } from "./NavBar";
import { SearchBar } from "./SearchBar";
import { Box } from "./Box";
import { SearchResults } from "./SearchResults";
import { MovieInfo } from "./MovieInfo";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedResults } from "./WatchedResults";
import { MainFeed } from "./MainFeed";
import { ResultStats } from "./ResultStats";

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

export const KEY = "8dcbdb66";

export const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	// State Prop Drilling
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("spider-verse");
	const [movies, setMovies] = useState(tempMovieData);
	const [selectedId, setSelectedId] = useState(null);
	const [watched, setWatched] = useState(tempWatchedData);

	// Handlers for selecting/deselecting movie
	const handleMovieSelect = (id) => {
		setSelectedId((curr) => (id === curr ? null : id));
	};
	const handleMovieClose = () => {
		setSelectedId(null);
	};

	// Handler for adding watched movie
	const handleAddWatched = (movie) => {
		setWatched((curr) => [...curr, movie]);
	};

	// Fetching movies as a side-effect
	useEffect(() => {
		async function fetchMovies() {
			try {
				// Loading & no error initially
				setIsLoading(true);
				setError("");

				// Getting Response
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
				);

				// Validating response
				if (!res.ok)
					throw new Error(
						"Something went wrong while fetching the movies"
					);

				// Getting json data from response & validating it
				const data = await res.json();
				if (data.Response === "False")
					throw new Error("Movie Not Found!!");

				// Store query results as movies
				setMovies(data.Search);
			} catch (err) {
				// Catching an error
				setError(err.message);
			} finally {
				// Finished loading despite of there being an error or not
				setIsLoading(false);
			}
		}
		// Dont Query API if search term is smaller than 3
		if (query.length < 3) {
			setError("");
			setMovies([]);
			return;
		}

		// Querying the API
		fetchMovies();
	}, [query]);

	return (
		<>
			<NavBar>
				<SearchBar query={query} setQuery={setQuery} />
				<ResultStats movies={movies} />
			</NavBar>
			<MainFeed>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<SearchResults
							onMovieSelect={handleMovieSelect}
							movies={movies}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieInfo
							selectedId={selectedId}
							onMovieClose={handleMovieClose}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedResults watched={watched} />
						</>
					)}
				</Box>
			</MainFeed>
		</>
	);
}

export const Loader = () => {
	return <p className="loader">Loading...</p>;
};

const ErrorMessage = ({ message }) => {
	return <p className="error">{message}</p>;
};
