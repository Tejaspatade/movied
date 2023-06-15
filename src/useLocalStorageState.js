import { useState, useEffect } from "react";

export const useLocalStorageState = (initially, key) => {
	const [value, setValue] = useState(() => {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : initially;
	});

	// Store watched movies to localstorage
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key, initially]);

	return [value, setValue];
};
