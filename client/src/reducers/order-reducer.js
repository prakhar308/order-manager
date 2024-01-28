import { produce } from "immer";

function reducer(order, action) {
  if (action.type === "update-product") {
    const { lineId, product } = action;
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);
      item.product = product;
      item.unitPrice = product?.price?.salePrice;
    });

    return nextState;
  } else if (action.type === "update-sale-unit") {
    const { lineId, unit } = action;
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);

      if (!unit) {
        item.saleQty = null;
      } else if (item.saleQty) {
        item.saleQty.unit = unit;
      } else {
        item.saleQty = { unit };
      }

      recalculateTotals(draftState);
    });
    return nextState;
  } else if (action.type === "update-return-unit") {
    const { lineId, unit } = action;
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);

      if (!unit) {
        item.returnQty = null;
      } else if (item.returnQty) {
        item.returnQty.unit = unit;
      } else {
        item.returnQty = { unit };
      }

      recalculateTotals(draftState);
    });
    return nextState;
  } else if (action.type === "update-sale-qty") {
    const { lineId, qty } = action;
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);

      if (item.saleQty) {
        item.saleQty.qty = qty;
      } else {
        item.saleQty = { qty };
      }
      recalculateTotals(draftState);
    });
    return nextState;
  } else if (action.type === "update-return-qty") {
    const { lineId, qty } = action;
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);

      if (item.returnQty) {
        item.returnQty.qty = qty;
      } else {
        item.returnQty = { qty };
      }
      recalculateTotals(draftState);
    });
    return nextState;
  } else if (action.type === "update-unit-price") {
    const { lineId, price } = action;
    const nextState = produce(order, (draftState) => {
      const item = draftState.items.find((item) => item.lineId === lineId);
      item.unitPrice = price;
      recalculateTotals(draftState);
    });
    return nextState;
  } else if (action.type === "add-empty-item") {
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
    return nextState;
  } else if (action.type === "delete-item") {
    const { lineId } = action;
    const nextState = produce(order, (draftState) => {
      draftState.items.splice(lineId - 1, 1);
      reassignLineIds(draftState);
      recalculateTotals(draftState);
    });
    return nextState;
  } else if (action.type === "update-order") {
    return action.order;
  }
}

const reassignLineIds = (draftState) => {
  draftState.items.forEach((item, i) => {
    item.lineId = i + 1;
  });
};

const recalculateTotals = (draftState) => {
  let orderTotal = 0;
  draftState?.items.forEach((item) => {
    const unitPrice = item.unitPrice || item.product?.price?.salePrice || 0;

    let saleQty = 0;
    if (!item.saleQty?.unit) {
      saleQty = 0;
    } else if (item.saleQty.unit == "case") {
      saleQty = item.product.casePacking * item.saleQty.qty;
    } else {
      saleQty = item.saleQty.qty;
    }

    let returnQty = 0;
    if (!item.returnQty?.unit) {
      returnQty = 0;
    } else if (item.returnQty.unit == "case") {
      returnQty = item.product.casePacking * item.returnQty.qty;
    } else {
      returnQty = item.returnQty.qty;
    }

    item.total = (saleQty - returnQty) * unitPrice || 0;

    // don't include last item's total in order toal as it is not added to the order yet
    if (item.lineId != draftState.items.length) {
      orderTotal += item.total;
    }
  });
  draftState.total = orderTotal;
};

export default reducer;
