import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../HomePage";
import CreateNewOrderPage from "../CreateNewOrderPage";

export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/create-new-order" element={<CreateNewOrderPage />} />
				<Route path="/" element={<HomePage />} />
			</Routes>
		</BrowserRouter>
	);
}
