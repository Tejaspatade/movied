import React from "react";
import { Movie } from "./Movie";

// List of movies from search result
export const SearchResults = ({ movies, onMovieSelect }) => {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onMovieSelect={onMovieSelect}
				/>
			))}
		</ul>
	);
};
