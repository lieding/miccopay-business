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
      state.confirmedOrderCnt++;
      break;
    case OrderStatus.FINISHED:
      state.finishedOrderCnt++;
      break;
    case OrderStatus.UNPAID:
      state.unPaidOrderCnt++;
      break;
    case OrderStatus.REFUNDED:
      state.refunedOrderCnt++;
      break;
    default:
  }
}

function getAmtCntEachTable (orders) {
  let cnt = 0;
  for (const order of orders) {
    cnt += order.amount || 0;
  }
  return cnt.toFixed(2);
}

function getAmtCntMap (tableMap, oldMap = {} ,table) {
  if (table) oldMap[table] = getAmtCntEachTable(tableMap.get(table))
  else {
    oldMap = {}
    for (const table of tableMap.keys())
      oldMap[table] = getAmtCntEachTable(tableMap.get(table))
  }
  return oldMap; 
} 

/**
 * For updating some value counts
 * 
*/
const updateCnt = (set) => () =>
  set((state) => {
    let paidOrderCnt = 0,
      finishedOrderCnt = 0,
      unPaidOrderCnt = 0,
      refunedOrderCnt = 0;
    const tableIterator = state.tableMap.values();
    for (const table of tableIterator) {
      if (!isValidArray(table)) continue;
      for (const order of table) {
        if (order.orderStatus === OrderStatus.PAID) ++paidOrderCnt;
        else if (order.orderStatus === OrderStatus.UNPAID) ++unPaidOrderCnt;
        else if (order.orderStatus === OrderStatus.FINISHED) ++finishedOrderCnt;
        else if (order.orderStatus === OrderStatus.REFUNDED) ++refunedOrderCnt;
      }
    }
    const tableAmtMap = getAmtCntMap(state.tableMap);
    return { paidOrderCnt, finishedOrderCnt, tableAmtMap, unPaidOrderCnt, refunedOrderCnt };
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
    for (const order of orders) {
      update(newState, order);
    }
    newState.tableAmtMap = getAmtCntMap(state.tableMap);
    return newState;
  });
};

const useWsStore = create((set) => ({
  tableMap: new Map(),
  tableAmtMap: {},
  unPaidOrderCnt: 0,
  paidOrderCnt: 0,
  confirmedOrderCnt: 0,
  finishedOrderCnt: 0,
  refunedOrderCnt: 0,
  handleNewMsg: handleNewMsg(set),
  insertPendingOrders: insertPendingOrders(set),
  updateCnt: updateCnt(set)
}));

export default useWsStore;
