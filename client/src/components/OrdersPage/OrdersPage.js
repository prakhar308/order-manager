import React from "react";

import { Link } from "react-router-dom";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

function OrdersPage() {
  return (
    <div>
      <Toolbar
        start={
          <div>
            <h2 className="m-0">Orders</h2>
            <Link to="/products">Products</Link>
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
