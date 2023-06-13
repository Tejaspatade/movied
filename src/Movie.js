import React from "react";

// Individual movie
export const Movie = ({ movie, onMovieSelect }) => {
	return (
		<li
			onClick={() => {
				onMovieSelect(movie.imdbID);
			}}
		>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
};