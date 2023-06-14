import { useState, useEffect } from "react";
import React from "react";
import Ratings from "./Ratings";
import { KEY, Loader } from "./App";

// Selected Movie with all details
export const MovieInfo = ({
	selectedId,
	watched,
	onMovieClose,
	onAddWatched,
}) => {
	// State to hold current movie with all info
	const [movie, setMovie] = useState("tt1596363");
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");

	// Derived States
	const {
		Poster,
		Title,
		Released,
		Runtime,
		Genre,
		imdbRating,
		Plot,
		Year,
		Actors,
		Director,
	} = movie;
	const isWatched = watched.map((w) => w.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(
		(w) => w.imdbID === selectedId
	)?.userRating;

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

	// Renaming the Website title as a side-effect
	useEffect(() => {
		if (!Title) return;
		document.title = Title;
		return () => (document.title = "Movied | Rate Movies You Watched");
	}, [Title]);

	// Listening to ESC keypress as a side-effect
	useEffect(() => {
		const callback = (e) => {
			if (!e.code === "Escape") return;
			onMovieClose();
		};
		document.addEventListener("keydown", callback);

		return () => {
			document.removeEventListener("keydown", callback);
		};
	}, [onMovieClose]);

	// Handle adding movie to watched list
	const handleAdd = () => {
		const watchedMovie = {
			imdbID: selectedId,
			poster: Poster,
			title: Title,
			year: Year,
			imdbRating: Number(imdbRating),
			runtime: Number(Runtime.split(" ").at(0)),
			userRating,
		};
		onAddWatched(watchedMovie);
		onMovieClose();
	};

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
							{!isWatched ? (
								<>
									<Ratings
										maxRating={10}
										size={36}
										onChangeRating={setUserRating}
									/>
									{userRating > 0 && (
										<button
											className="btn-add"
											onClick={handleAdd}
										>
											Add to Watched List
										</button>
									)}
								</>
							) : (
								<p>
									You rated this movie: {watchedUserRating}⭐
								</p>
							)}
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
