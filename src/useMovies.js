import { useState, useEffect } from "react";

const KEY = "8dcbdb66";

export const useMovies = (query) => {
	// States
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [movies, setMovies] = useState([]);

	// Controller to abort unnecessary fetch requests
	const controller = new AbortController();

	// Fetching movies as a side-effect
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
				// Catch Block
				if (err.name !== "AbortError")
					// Catching an error
					setError(err.message);
			} finally {
				// Finlly Block
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

		// Clean-up
		return () => {
			controller.abort();
		};
	}, [query]);

	return { isLoading, error, movies };
};
