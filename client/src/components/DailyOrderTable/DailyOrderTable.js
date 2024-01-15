import React from "react";

import { InputText } from "primereact/Inputtext";
import { InputNumber } from "primereact/InputNumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import { produce } from "immer";

import ProductSearch from "../ProductSearch";

function DailyOrderTable() {
  const [order, setOrder] = React.useState({ items: [] });

  console.log(order);

  React.useEffect(() => {
    // read from localStorage or API later
    const order = {
      date: null,
      items: [
        {
          lineId: 1,
          product: {
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
          saleQty: {
            unit: "pcs",
            qty: 10,
          },
          unitPrice: 70,
          returnQty: {
            unit: "pcs",
            qty: 2,
          },
          total: 560,
        },
        {
          lineId: 2,
          product: {
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
          unitPrice: 80,
          saleQty: {
            unit: "case",
            qty: 1,
          },
          returnQty: {
            unit: "pcs",
            qty: 2,
          },
          total: 1760,
        },
        {
          lineId: 3,
          product: {
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
          unitPrice: 90,
          saleQty: {
            unit: "pcs",
            qty: 10,
          },
          total: 990,
        },
      ],
      total: 1700,
    };

    // const order = { items: [] };

    // push emty row at the end
    const newItem = {
      lineId: order.items.length + 1,
      product: null,
      saleQty: null,
      returnQty: null,
      total: null,
    };
    order.items.push(newItem);
    setOrder(order);
  }, []);

  const handlePriceChange = (lineId, price) => {
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);
      item.unitPrice = price;
      recalculateTotals(draftState);
    });
    setOrder(nextState);
  };

  const priceEditor = (lineId, price) => {
    return (
      <InputNumber
        value={price}
        onValueChange={(e) => handlePriceChange(lineId, e.value)}
        mode="currency"
        currency="INR"
        locale="en-US"
      />
    );
  };

  const handleUnitChange = (lineId, unit, type) => {
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);

      if (type === "sale") {
        if (!unit) {
          item.saleQty = null;
        } else if (item.saleQty) {
          item.saleQty.unit = unit;
        } else {
          item.saleQty = { unit };
        }
      }

      if (type === "return") {
        if (!unit) {
          item.returnQty = null;
        } else if (item.returnQty) {
          item.returnQty.unit = unit;
        } else {
          item.returnQty = { unit };
        }
      }

      recalculateTotals(draftState);
    });
    setOrder(nextState);
  };

  const unitEditor = (lineId, unit, type) => {
    return (
      <Dropdown
        value={unit}
        placeholder="Select Unit"
        options={["pcs", "case"]}
        onChange={(e) => handleUnitChange(lineId, e.value, type)}
        showClear
      />
    );
  };

  const handleQtyChange = (lineId, qty, type) => {
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);

      if (type === "sale") {
        if (item.saleQty) {
          item.saleQty.qty = qty;
        } else {
          item.saleQty = { qty };
        }
      }

      if (type === "return") {
        if (item.returnQty) {
          item.returnQty.qty = qty;
        } else {
          item.returnQty = { qty };
        }
      }
      recalculateTotals(draftState);
    });
    setOrder(nextState);
  };

  const qtyEditor = (lineId, qty, type) => {
    return (
      <InputNumber
        value={qty}
        onValueChange={(e) => handleQtyChange(lineId, e.value, type)}
      />
    );
  };

  const handleProductChange = (lineId, product) => {
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);
      item.product = product;
      item.unitPrice = product.price.salePrice;
    });

    setOrder(nextState);
  };

  const recalculateTotals = (draftState) => {
    let orderTotal = 0;
    draftState?.items.forEach((item) => {
      const unitPrice = item.unitPrice || item.product?.price?.salePrice || 0;

      let saleQty = 0;
      if (!item.saleQty) {
        saleQty = 0;
      } else if (item.saleQty.unit == "case") {
        saleQty = item.product.casePacking * item.saleQty.qty;
      } else {
        saleQty = item.saleQty.qty;
      }

      let returnQty = 0;
      if (!item.returnQty) {
        returnQty = 0;
      } else if (item.returnQty.unit == "case") {
        returnQty = item.product.casePacking * item.returnQty.qty;
      } else {
        returnQty = item.returnQty.qty;
      }

      item.total = (saleQty - returnQty) * unitPrice || 0;
      orderTotal += item.total;
    });
    draftState.total = orderTotal;
  };

  const addItemToOrder = () => {
    // Actually the item is already added. We just to need to add an an empty row
    const emptyItem = {
      lineId: order.items.length + 1,
      product: null,
      saleQty: null,
      returnQty: null,
      total: null,
    };

    const nextState = produce(order, (draftState) => {
      draftState.items.push(emptyItem);
      recalculateTotals(draftState);
    });

    setOrder(nextState);
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Sr.No" rowSpan={2} />
        <Column header="Product" rowSpan={2} />
        <Column header="Sale" colSpan={2} />
        <Column header="Unit Price" rowSpan={2} />
        <Column header="Return" colSpan={2} />
        <Column header="Total" rowSpan={2} />
      </Row>
      <Row>
        <Column header="Unit" field="saleQty.unit" />
        <Column header="Qty" field="saleQty.qty" />
        <Column header="Unit" field="returnQty.unit" />
        <Column header="Qty" field="returnQty.qty" />
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Total:"
          colSpan={7}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={order?.total} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="card p-fluid">
      <DataTable
        showGridlines
        headerColumnGroup={headerGroup}
        footerColumnGroup={footerGroup}
        value={order?.items}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="lineId" header="Sr.No" style={{ width: "5%" }} />
        <Column
          field="product.name"
          header="Product"
          style={{ width: "15%" }}
          body={({ lineId, product }) =>
            lineId == order.items.length ? (
              <ProductSearch
                product={product}
                onChange={(newProduct) =>
                  handleProductChange(lineId, newProduct)
                }
              />
            ) : (
              product?.name
            )
          }
        />
        <Column
          style={{ width: "15%" }}
          field="saleQty.unit"
          body={({ lineId, saleQty }) =>
            unitEditor(lineId, saleQty?.unit, "sale")
          }
        />
        <Column
          style={{ width: "15%" }}
          field="saleQty.qty"
          body={({ lineId, saleQty }) =>
            qtyEditor(lineId, saleQty?.qty, "sale")
          }
        />
        <Column
          style={{ width: "15%" }}
          field="unitPrice"
          header="Unit Price"
          body={({ lineId, unitPrice }) => priceEditor(lineId, unitPrice)}
        />
        <Column
          style={{ width: "15%" }}
          field="returnQty.unit"
          body={({ lineId, returnQty }) =>
            unitEditor(lineId, returnQty?.unit, "return")
          }
        />
        <Column
          style={{ width: "15%" }}
          field="returnQty.qty"
          body={({ lineId, returnQty }) =>
            qtyEditor(lineId, returnQty?.qty, "return")
          }
        />
        <Column
          field="total"
          header="Total"
          style={{ width: "5%" }}
          body={({ lineId, total }) =>
            lineId === order.items.length ? (
              <Button
                label="Add"
                icon="pi pi-plus"
                severity="success"
                onClick={() => addItemToOrder()}
              />
            ) : (
              total
            )
          }
        />
      </DataTable>
    </div>
  );
}

export default DailyOrderTable;
