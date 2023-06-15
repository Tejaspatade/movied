import { useEffect } from "react";

export const useKeyPress = (key, action) => {
	useEffect(() => {
		const callback = (e) => {
			if (!e.code.toLowerCase() === key.toLowerCase()) return;
			action();
		};
		document.addEventListener("keydown", callback);

		return () => {
			document.removeEventListener("keydown", callback);
		};
	}, [key, action]);
};
