import React from "react";

import { Link } from "react-router-dom";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

import DailyOrderTable from "../DailyOrderTable";

function CreateNewOrderPage() {
  return (
    <div>
      <DailyOrderTable />
    </div>
  );
}

export default CreateNewOrderPage;
