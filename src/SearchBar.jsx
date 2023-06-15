import React, { useRef } from "react";
import { useKeyPress } from "./useKeyPress";

// Search Bar
export const SearchBar = ({ query, setQuery }) => {
	// Reference Hook
	const searchBar = useRef(null);

	// Setting cursor in the search bar as a side-effect
	useKeyPress("Enter", () => {
		if (document.activeElement === searchBar.current) return;
		searchBar.current.focus();
		setQuery("");
	});

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={searchBar}
		/>
	);
};
