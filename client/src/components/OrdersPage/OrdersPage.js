import React from "react";

import { Link } from "react-router-dom";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import Navbar from "../Navbar";
import OrderGrid from "./OrderGrid";

function OrdersPage() {
  const [orders, setOrders] = React.useState([]);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState(null);
  const toast = React.useRef(null);

  React.useEffect(() => {
    // later read from local storage or API
    let _orders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(_orders);
  }, []);

  const deleteOrder = () => {
    if (!orderToDelete) {
      throw new Error("Order deletion failed. Order to delete not set");
    }

    let _orders = orders.filter((order) => order.id !== orderToDelete.id);

    localStorage.setItem("orders", JSON.stringify(_orders));

    setOrders(_orders);
    setShowDeleteOrderModal(false);
    setOrderToDelete(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Order Deleted",
      life: 3000,
    });
  };

  const deleteOrderDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setShowDeleteOrderModal((x) => !x)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteOrder}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <Navbar
        className="mb-4"
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
            />
          </Link>
        }
      />
      <OrderGrid
        orders={orders}
        setShowDeleteOrderModal={setShowDeleteOrderModal}
        setOrderToDelete={setOrderToDelete}
      />
      <Dialog
        visible={showDeleteOrderModal}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteOrderDialogFooter}
        onHide={() => setShowDeleteOrderModal((x) => !x)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {<span>Are you sure you want to delete the order</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default OrdersPage;
