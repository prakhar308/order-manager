import React from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const formatCurrency = (value) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });
};

function ProductGrid({
  products,
  setProduct,
  setShowProductDialog,
  setShowDeleteProductDialog,
}) {
  const editProduct = (product) => {
    setProduct({ ...product });
    setShowProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setShowDeleteProductDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  return (
    <DataTable showGridlines value={products} emptyMessage="No products found.">
      <Column field="code" header="Code" style={{ width: "20%" }} />
      <Column field="name" header="Name" style={{ width: "20%" }} />
      <Column field="brand" header="Brand" style={{ width: "20%" }} />
      <Column
        field="price.salePrice"
        header="Unit Price"
        body={(rowData) => formatCurrency(rowData.price.salePrice)}
        style={{ width: "20%" }}
      />
      <Column body={actionBodyTemplate} exportable={false}></Column>
    </DataTable>
  );
}

export default ProductGrid;
