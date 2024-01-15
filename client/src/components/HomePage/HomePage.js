import React from "react";

import { Button } from "primereact/button";

import DailyOrderTable from "../DailyOrderTable";

function HomePage() {
  return (
    <div>
      <h1>Order Manager</h1>
      <DailyOrderTable />
    </div>
  );
}

export default HomePage;
