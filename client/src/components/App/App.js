import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../HomePage";
import DailyOrderTable from "../DailyOrderTable";
import ProductsPage from "../ProductsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/create-new-order" element={<DailyOrderTable />} />
        <Route path="/orders/:id" element={<DailyOrderTable />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
