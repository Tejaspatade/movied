import { useState } from "react";
import React from "react";

// Box component to hold list of movies
export const Box = ({ children }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen((open) => !open)}
			>
				{isOpen ? "-" : "+"}
			</button>
			{isOpen && children}
		</div>
	);
};
