import React from "react";

import { Link } from "react-router-dom";

import { Button } from "primereact/button";

import Navbar from "../Navbar";

function OrdersPage() {
  return (
    <div>
      <Navbar
        start={
          <div>
            <h2 className="m-0">Orders</h2>
          </div>
        }
        end={
          <Link to="/create-new-order">
            <Button
              label="Create New Order"
              icon="pi pi-plus"
              severity="success"
              onClick={() => {}}
            />
          </Link>
        }
      />
      Orders Grid will be displayed here
    </div>
  );
}

export default OrdersPage;
