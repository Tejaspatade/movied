import React from "react";
import { Logo } from "./Logo";

// Navigation Bar
export const NavBar = ({ children }) => {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
};
