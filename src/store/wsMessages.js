import { create } from "zustand";
import { OrderStatus } from "../consts";
import { isValidArray, isValidStr } from "../utils";

function update(state, item) {
  const { table, orderStatus } = item;
  if (table) {
    if (state.tableMap.has(table)) state.tableMap.get(table).push(item);
    else state.tableMap.set(table, [item]);
  }
  switch (orderStatus) {
    case OrderStatus.PAID:
      state.paidOrderCnt++;
      break;
    case OrderStatus.CONFIRMED:
      state.confirmedorderCnt++;
      break;
    case OrderStatus.FINISHED:
      state.finishedOrderCnt++;
      break;
    default:
  }
}

const updateCnt = (set) => () =>
  set((state) => {
    let paidOrderCnt = 0,
      finishedOrderCnt = 0;
    const tableIterator = state.tableMap.values();
    for (const table of tableIterator) {
      if (!isValidArray(table)) continue;
      for (const order of table) {
        if (order.orderStatus === OrderStatus.PAID) ++paidOrderCnt;
        else if (order.orderStatus === OrderStatus.FINISHED) ++finishedOrderCnt;
      }
    }
    return { paidOrderCnt, finishedOrderCnt };
  });

const handleNewMsg = (set) => (data) => {
  try {
    set((state) => {
      const newState = { ...state };
      update(newState, data);
      return newState;
    });
  } catch (error) {
    console.error(error);
  }
};

const insertPendingOrders = (set) => (orders) => {
  if (!isValidArray(orders)) return;
  set((state) => {
    state.tableMap.clear();
    const newState = { ...state };
    for (const order of orders) update(newState, order);
    return newState;
  });
};

const useWsStore = create((set) => ({
  tableMap: new Map(),
  paidOrderCnt: 0,
  confirmedorderCnt: 0,
  finishedOrderCnt: 0,
  handleNewMsg: handleNewMsg(set),
  insertPendingOrders: insertPendingOrders(set),
  updateCnt: updateCnt(set)
}));

export default useWsStore;
