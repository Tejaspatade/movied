import React from "react";
import ReactDOM from "react-dom/client";

// import App from "./App";
// import "./index.css";
import Ratings from "./Ratings";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Ratings maxRating={10} />
	</React.StrictMode>
);
