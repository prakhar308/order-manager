import React from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

const formatCurrency = (value) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });
};

const formatDate = (value) => {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function OrderGrid({ orders, setShowDeleteOrderModal, setOrderToDelete }) {
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Link to={`/orders/${rowData.id}`}>
          <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
        </Link>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => {
            setOrderToDelete(rowData);
            setShowDeleteOrderModal((x) => !x);
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <div>
      <DataTable showGridlines value={orders} emptyMessage="No orders found.">
        <Column
          field="date"
          header="Date"
          dataType="date"
          style={{ width: "33%" }}
          body={(rowData) => formatDate(new Date(rowData.date))}
        />
        <Column
          field="total"
          header="Total"
          body={(rowData) => formatCurrency(rowData.total)}
          style={{ width: "33%" }}
        />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "33%" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default OrderGrid;
