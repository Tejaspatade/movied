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

export const KEY = "8dcbdb66";

export const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	// State Prop Drilling
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [watched, setWatched] = useState([]);

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

	// Handler for removing watched movie
	const handleRemoveWatched = (id) => {
		setWatched((curr) => curr.filter((m) => m.imdbID !== id));
	};

	// Controller to abort unnecessary fetch requests
	const controller = new AbortController();

	// Fetching movies as a side-effect
	useEffect(() => {
		async function fetchMovies() {
			try {
				// Loading & no error initially
				setIsLoading(true);
				setError("");

				// Getting Response
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
					{ signal: controller.signal }
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
				setError("");
			} catch (err) {
				if (err.name !== "AbortError")
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
		handleMovieClose();
		fetchMovies();

		// Clean-up
		return () => {
			controller.abort();
		};
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
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedResults
								watched={watched}
								onRemoveWatched={handleRemoveWatched}
							/>
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
