import React from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

import { App } from "./App";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<PrimeReactProvider>
			<App />
		</PrimeReactProvider>
	</React.StrictMode>,
);
