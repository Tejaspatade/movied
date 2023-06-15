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
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

export default function App() {
	// State
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	// Custom Hooks
	const { isLoading, error, movies } = useMovies(query, handleMovieClose);
	const [watched, setWatched] = useLocalStorageState([], "watched");

	// Handler for selecting a movie
	function handleMovieSelect(id) {
		setSelectedId((curr) => (id === curr ? null : id));
	}

	// Handler for deselecting a movie
	function handleMovieClose() {
		setSelectedId(null);
	}

	// Handler for adding watched movie &
	const handleAddWatched = (movie) => {
		setWatched((curr) => [...curr, movie]);
	};

	// Handler for removing watched movie
	const handleRemoveWatched = (id) => {
		setWatched((curr) => curr.filter((m) => m.imdbID !== id));
	};

	// Store watched movies to localstorage
	useEffect(() => {
		localStorage.setItem("watched", JSON.stringify(watched));
	}, [watched]);

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
