import { useState, useEffect } from "react";
import React from "react";
import Ratings from "./Ratings";
import { KEY, Loader } from "./App";

// Selected Movie with all details
export const MovieInfo = ({ selectedId, onMovieClose }) => {
	// State to hold current movie with all info
	const [movie, setMovie] = useState("tt1596363");
	const [isLoading, setIsLoading] = useState(false);

	const {
		Poster,
		Title,
		Released,
		Runtime,
		Genre,
		imdbRating,
		Plot,
		Actors,
		Director,
	} = movie;

	// Fetching movie info as a side-effect of a changed selectedId
	useEffect(() => {
		async function getMovieInfo() {
			// Loading
			setIsLoading(true);

			// Getting Response
			const res = await fetch(
				`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
			);

			// Getting json data from response & validating it
			const data = await res.json();

			// Storing data in state
			setMovie(data);

			// Finished Loading
			setIsLoading(false);
		}
		getMovieInfo();
	}, [selectedId]);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onMovieClose}>
							&larr;
						</button>
						<img src={Poster} alt={`Poster of ${Title}`} />
						<div className="details-overview">
							<h2>{Title}</h2>
							<p>
								{Released} &bull; {Runtime}
							</p>
							<p>{Genre}</p>
							<p>
								<span>⭐️</span>
								{imdbRating} IMDb Rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							<Ratings maxRating={10} size={36} />
						</div>
						<p>
							<em>{Plot}</em>
						</p>
						<p>Starring: {Actors}</p>
						<p>Director: {Director}</p>
					</section>
				</>
			)}
		</div>
	);
};
