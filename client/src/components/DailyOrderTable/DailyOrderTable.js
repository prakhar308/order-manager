import React from "react";
import { useLocation } from "react-router-dom";

import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import { produce } from "immer";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";

import ProductSearch from "../ProductSearch";
import orderReducer from "../../reducers/order-reducer";
import Navbar from "../Navbar";

function createEmptyOrder() {
  return {
    id: crypto.randomUUID(),
    date: new Date(),
    items: [
      {
        lineId: 1,
        product: null,
        saleQty: null,
        returnQty: null,
        total: null,
      },
    ],
    total: null,
  };
}

function DailyOrderTable() {
  const location = useLocation();

  let initalOrderState = null;
  if (location.pathname.includes("/create-new-order")) {
    initalOrderState = createEmptyOrder();
  }
  const [order, dispatch] = React.useReducer(orderReducer, initalOrderState);
  const [orders, setOrders] = React.useState([]);
  const toast = React.useRef(null);

  let orderNotFound = false;

  React.useEffect(() => {
    const _orders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(_orders);
    if (location.pathname.includes("/orders")) {
      const id = location.pathname.split("/").pop();
      const order = _orders.find((order) => order.id === id);
      if (!order) {
        return;
      }
      dispatch({
        type: "update-order",
        order: order,
      });
      dispatch({
        type: "add-empty-item",
      });
    }
  }, [location.pathname]);

  // console.log(order);

  const saveOrder = () => {
    // remove the last empty item
    const nextOrder = produce(order, (draftState) => {
      draftState.items.pop();
    });

    const nextOrders = produce(orders, (draftState) => {
      if (!draftState) {
        draftState = [nextOrder];
      } else {
        const index = draftState.findIndex((o) => o.id === order.id);
        if (index !== -1) {
          draftState.splice(index, 1, nextOrder);
        } else {
          draftState.push(nextOrder);
        }
      }
    });
    setOrders(nextOrders);

    localStorage.setItem("orders", JSON.stringify(nextOrders));
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Order Saved",
      life: 3000,
    });
  };

  const getTabIndex = (lineId) => {
    // remove navigation from all rows except last row
    if (lineId === order.items.length) {
      return 0;
    } else {
      return -1;
    }
  };

  const handlePriceChange = (lineId, price) => {
    dispatch({
      type: "update-unit-price",
      lineId,
      price,
    });
  };

  const priceEditor = (lineId, price) => {
    return (
      <InputNumber
        tabIndex={getTabIndex(lineId)}
        value={price}
        onValueChange={(e) => handlePriceChange(lineId, e.value)}
        mode="currency"
        currency="INR"
        locale="en-US"
      />
    );
  };

  const handleUnitChange = (lineId, unit, type) => {
    if (type === "sale") {
      dispatch({
        type: "update-sale-unit",
        lineId,
        unit,
      });
    } else if (type === "return") {
      dispatch({
        type: "update-return-unit",
        lineId,
        unit,
      });
    }
  };

  const isUnitEditorDisabled = (lineId) => {
    return !order.items.find((item) => item.lineId === lineId)?.product;
  };

  const unitEditor = (lineId, unit, type) => {
    return (
      <Dropdown
        tabIndex={getTabIndex(lineId)}
        disabled={isUnitEditorDisabled(lineId)}
        value={unit}
        placeholder="Select Unit"
        options={["pcs", "case"]}
        onChange={(e) => handleUnitChange(lineId, e.value, type)}
        showClear
      />
    );
  };

  const handleQtyChange = (lineId, qty, type) => {
    if (type === "sale") {
      dispatch({
        type: "update-sale-qty",
        lineId,
        qty,
      });
    } else if (type === "return") {
      dispatch({
        type: "update-return-qty",
        lineId,
        qty,
      });
    }
  };

  const qtyEditor = (lineId, qty, type) => {
    return (
      <InputNumber
        tabIndex={getTabIndex(lineId)}
        value={qty}
        onValueChange={(e) => handleQtyChange(lineId, e.value, type)}
      />
    );
  };

  const handleProductChange = (lineId, product) => {
    dispatch({
      type: "update-product",
      lineId,
      product,
    });
  };

  const isAddButtonDisabled = () => {
    const item = order.items.slice(-1)[0];
    return !item.product || !item.saleQty?.unit || !item.saleQty.qty;
  };

  const addItemToOrder = () => {
    dispatch({
      type: "add-empty-item",
    });
  };

  const deleteOrderItem = (lineId) => {
    dispatch({
      type: "delete-item",
      lineId,
    });
  };

  const actionBodyTemplate = (lineId) => {
    return (
      <Button
        tabIndex="-1"
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => deleteOrderItem(lineId)}
      />
    );
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
        <Column rowSpan={2} />
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
        <Column />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="card p-fluid">
      <Toast ref={toast} position="top-center" />
      <Navbar
        className="mb-4"
        start={
          <div className="flex gap-4 align-items-center">
            <Link to="/" tabIndex="-1">
              <h2 className="m-0">Orders</h2>
            </Link>
          </div>
        }
        end={
          <div className="flex gap-2">
            <Link to="/" tabIndex="-1">
              <Button tabIndex="-1" severity="secondary" label="Cancel" />
            </Link>
            <Button
              tabIndex="-1"
              label="Save"
              severity="success"
              onClick={() => saveOrder()}
            />
          </div>
        }
      />
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
                disabled={isAddButtonDisabled()}
                onClick={() => addItemToOrder()}
              />
            ) : (
              total
            )
          }
        />
        <Column
          body={({ lineId }) =>
            lineId != order.items.length ? actionBodyTemplate(lineId) : null
          }
        />
      </DataTable>
    </div>
  );
}

export default DailyOrderTable;
