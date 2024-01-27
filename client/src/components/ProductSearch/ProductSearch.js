import React from "react";
import { Dropdown } from "primereact/dropdown";

function ProductSearch({ product, onChange }) {
  const dropdownRef = React.useRef(null);
  const [selectedProduct, setSelectedProduct] = React.useState(product || null);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    // later read from local storage or API
    setProducts([
      {
        code: "180",
        name: "Dahi 400g",
        brand: "Gowardhan",
        unitTypes: ["pcs", "case"],
        price: {
          salePrice: 70,
        },
        weight: { unit: "g", value: 400 },
        casePacking: 24,
      },
      {
        code: "181",
        name: "Dahi PP 500g",
        brand: "Gowardhan",
        unitTypes: ["pcs", "case"],
        price: {
          salePrice: 80,
        },
        weight: { unit: "g", value: 500 },
        casePacking: 24,
      },
      {
        code: "200",
        name: "Paneer 200g",
        brand: "Gowardhan",
        unitTypes: ["pcs", "case"],
        price: {
          salePrice: 80,
        },
        weight: { unit: "g", value: 200 },
        casePacking: 24,
      },
    ]);
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
      onChange={(e) => handleProductChange(e)}
      onHide={handleHide}
      options={products}
      optionLabel="name"
      placeholder="Select a Product"
      filter
      className="w-full md:w-14rem"
    />
  );
}

export default ProductSearch;
