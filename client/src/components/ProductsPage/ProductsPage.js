import React from "react";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Link } from "react-router-dom";

import ProductGrid from "./ProductGrid";
import ProductModal from "./ProductModal";

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
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // later read from local storage or API
    let _products = JSON.parse(localStorage.getItem("products"));
    setProducts(_products);
  }, []);

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
              <Button
                icon="pi pi-arrow-right"
                onClick={() => setVisible(true)}
              />
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
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <h2>Sidebar</h2>
          <Link to="/">
            <h2 className="m-0">Home</h2>
          </Link>
        </Sidebar>
        <ProductGrid
          products={products}
          setProduct={setProduct}
          setShowProductDialog={setShowProductDialog}
          setShowDeleteProductDialog={setShowDeleteProductDialog}
        />
        <ProductModal
          showProductDialog={showProductDialog}
          setShowProductDialog={setShowProductDialog}
          product={product}
          emptyProduct={emptyProduct}
          setProduct={setProduct}
          setProducts={setProducts}
        />
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
