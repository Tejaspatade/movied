import React from "react";

// Results stats from the search bar
export const ResultStats = ({ movies }) => {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
};
