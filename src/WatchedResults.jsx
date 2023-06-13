import React from "react";
import { WatchedMovie } from "./WatchedMovie";

// Watched movies list
export const WatchedResults = ({ watched }) => {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie movie={movie} key={movie.imdbID} />
			))}
		</ul>
	);
};
