import React from "react";

import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/InputNumber";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import { produce } from "immer";

function ProductsPage() {
  const emptyProduct = {
    code: "",
    name: "",
    brand: "",
    price: {
      salePrice: 0,
    },
    weight: {
      unit: null,
      value: null,
    },
    casePacking: 0,
  };
  const [product, setProduct] = React.useState(emptyProduct);
  const [products, setProducts] = React.useState([]);
  const [showProductDialog, setShowProductDialog] = React.useState(false);
  const [showDeleteProductDialog, setShowDeleteProductDialog] =
    React.useState(false);
  const toast = React.useRef(null);

  React.useEffect(() => {
    // later read from local storage or API
    let _products = JSON.parse(localStorage.getItem("products"));
    setProducts(_products);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let _products = JSON.parse(localStorage.getItem("products"));
    if (!_products) {
      _products = [product];
    } else {
      const index = _products.findIndex((p) => p.code === product.code);
      if (index !== -1) {
        _products.splice(index, 1, product);
      } else {
        _products.push(product);
      }
    }

    localStorage.setItem("products", JSON.stringify(_products));
    setProduct(emptyProduct);
    setProducts(_products);
    setShowProductDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Product Saved",
      life: 3000,
    });
  };

  const handleWeightUnitChange = (e) => {
    const nextState = produce(product, (draftState) => {
      draftState.weight.unit = e.target.value;
    });
    setProduct(nextState);
  };

  const handleWeightValueChange = (e) => {
    const nextState = produce(product, (draftState) => {
      draftState.weight.value = e.target.value;
    });
    setProduct(nextState);
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setShowProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setShowDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.code !== product.code);

    localStorage.setItem("products", JSON.stringify(_products));

    setProducts(_products);
    setShowDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
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

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setShowDeleteProductDialog((x) => !x)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <div className="card">
        <Toolbar
          className="mb-4"
          start={
            <div>
              <h2 className="m-0">Products</h2>
            </div>
          }
          end={
            <Button
              label="Create New Product"
              icon="pi pi-plus"
              severity="success"
              onClick={() => {
                setProduct(emptyProduct);
                setShowProductDialog((x) => !x);
              }}
            />
          }
        />
        <DataTable
          showGridlines
          value={products}
          emptyMessage="No products found."
        >
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
        <Dialog
          visible={showProductDialog}
          header="Product Details"
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          modal
          className="p-fluid"
          onHide={() => setShowProductDialog((x) => !x)}
        >
          <form onSubmit={(e) => handleFormSubmit(e)}>
            <div className="field">
              <label htmlFor="code" className="font-bold">
                Code
              </label>
              <InputText
                id="code"
                value={product.code}
                onChange={(e) => {
                  setProduct({ ...product, code: e.target.value });
                }}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <InputText
                id="name"
                value={product.name}
                onChange={(e) => {
                  setProduct({ ...product, name: e.target.value });
                }}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="brand" className="font-bold">
                Brand
              </label>
              <InputText
                id="brand"
                value={product.brand}
                onChange={(e) => {
                  setProduct({ ...product, brand: e.target.value });
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="price" className="font-bold">
                Unit Price
              </label>
              <InputNumber
                id="price"
                value={product.price?.salePrice}
                onValueChange={(e) => {
                  setProduct({
                    ...product,
                    price: { salePrice: e.target.value },
                  });
                }}
                required
                mode="currency"
                currency="INR"
                locale="en-US"
              />
            </div>
            <div className="field font-bold">Weight</div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price" className="font-bold">
                  Unit
                </label>
                <Dropdown
                  value={product.weight?.unit}
                  options={["g", "kg", "ml", "L"]}
                  onChange={(e) => handleWeightUnitChange(e)}
                  showClear
                />
              </div>
              <div className="field col">
                <label htmlFor="value" className="font-bold">
                  Value
                </label>
                <InputNumber
                  id="value"
                  value={product.weight?.value}
                  onValueChange={(e) => {
                    handleWeightValueChange(e);
                  }}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="casePacking" className="font-bold">
                Case Packing
              </label>
              <InputNumber
                id="casePacking"
                value={product.casePacking}
                onValueChange={(e) => {
                  setProduct({
                    ...product,
                    casePacking: e.target.value,
                  });
                }}
              />
            </div>
            <div className="p-dialog-footer p-0">
              <Button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={() => setShowProductDialog((x) => !x)}
              />
              <Button label="Save" icon="pi pi-check" />
            </div>
          </form>
        </Dialog>
        <Dialog
          visible={showDeleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteProductDialogFooter}
          onHide={() => setShowDeleteProductDialog((x) => !x)}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Are you sure you want to delete <b>{product.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default ProductsPage;
