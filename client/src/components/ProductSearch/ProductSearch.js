import React from "react";
import { Dropdown } from "primereact/dropdown";

function ProductSearch({ product, onChange }) {
  const dropdownRef = React.useRef(null);
  const [selectedProduct, setSelectedProduct] = React.useState(product || null);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    // later read from local storage or API
    let _products = JSON.parse(localStorage.getItem("products"));
    setProducts(_products);
  }, []);

  const handleProductChange = (event) => {
    setSelectedProduct(event.value);
    onChange(event.value);
  };

  const handleHide = () => {
    dropdownRef.current.focus(); // loses focus when selected through keyboard
  };

  return (
    <Dropdown
      ref={dropdownRef}
      value={selectedProduct}
      className="w-full md:w-14rem"
      options={products}
      optionLabel="name"
      placeholder="Select a Product"
      onChange={(e) => handleProductChange(e)}
      onHide={handleHide}
      filter
      filterBy="code,name"
      showClear
    />
  );
}

export default ProductSearch;
