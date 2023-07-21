import { useState, useEffect, useCallback, useRef } from "react";
import { MessageAction, OrderStatus, WEBSOCKET_URL } from "../consts";
import { useWsStore, useConfigStore } from "../store";
import { isValidArray, isValidStr } from "../utils";

function setReturnKey(map, returnKey, data) {
  const { table, action, id, orderStatus } = data;
  if (!table || !id) return;
  map.set(returnKey, { table, action, id, orderStatus });
}

function changeOrderStatusInMap(tableMap, table, id, newStatus) {
  const orders = tableMap.get(table);
  if (!isValidArray(orders))
    return console.error(
      "unable to find the corresponding orderList by given 'table'"
    );
  const idx = orders.findIndex((order) => order.id === id);
  if (idx < 0)
    return console.error(
      "unable to find the corresponding order by given 'id'"
    );
  if (newStatus === "archived") orders.splice(idx, 1);
  else {
    orders[idx].orderStatus = newStatus;
  }
  tableMap.set(table, orders.slice());
}

/**
 * this function is used to handle the mutation return messgae,
 * the actions such as 'setRestaurantId', 'confirmAction', 'finishAction',
 * for certain actions, we need to update the local store
 *  */
function handleReturnKey(map, data) {
  const { returnKey, error } = data;
  if (!returnKey) return;
  if (map.has(returnKey) && !error) {
    const { action, table, id } = map.get(returnKey);
    const { tableMap } = useWsStore.getState();
    switch (action) {
      case MessageAction.SetRestaurantId:
        break;
      case MessageAction.Confirm:
        changeOrderStatusInMap(tableMap, table, id, OrderStatus.CONFIRMED);
        break;
      case MessageAction.Finish:
        changeOrderStatusInMap(tableMap, table, id, OrderStatus.FINISHED);
        break;
      case MessageAction.Cancel:
        changeOrderStatusInMap(tableMap, table, id, OrderStatus.CANCELED);
        break;
      case MessageAction.ArchiveOrder:
        changeOrderStatusInMap(tableMap, table, id, "archived");
        break;
      default:
    }
  }
  map.delete(returnKey);
}

const useWebsocket = (config) => {
  const socketRef = useRef(null);
  const heartIntervalRef = useRef(null);
  const reconnectIntervalRef = useRef(null);
  const [connectionStatus, setConnStatus] = useState(
    SocketConnectionStatus.IDLE
  );
  const [returnKeyMap] = useState(new Map());

  const sendMessage = useCallback((data) => {
    if (!data.action)
      return console.error("invalid 'action' property of the meesage to send");
    const { restaurantId } = useConfigStore.getState();
    if (!restaurantId) return console.error("empty restqurantId value");
    const returnKey = Date.now();
    setReturnKey(returnKeyMap, returnKey, data);
    data = {
      restaurantId,
      returnKey,
      id: data.id,
      action: data.action,
      table: data.table
    };
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify(data));
  }, []);

  const onSocketOpen = useCallback(() => {
    console.log("websocket connected");
    clearInterval(reconnectIntervalRef.current);
    setConnStatus(SocketConnectionStatus.CONNECTED);
    sendMessage({ action: MessageAction.SetRestaurantId });
    const sendHeart = () => {
      const socket = socketRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) socket.send("/ping");
    };
    heartIntervalRef.current = setInterval(sendHeart, 90 * 1000);
    // eslint-disable-next-line
    config?.connectedCbk?.();
  }, []);

  const onSocketClose = useCallback(() => {
    console.log("websocket closed or errored");
    setConnStatus(SocketConnectionStatus.CLOSED);
    clearInterval(heartIntervalRef.current);
    reconnectIntervalRef.current = setInterval(connectWebsocket, 30 * 1000);
  }, []);

  const onSocketMessage = useCallback((msg) => {
    const { handleNewMsg, updateCnt } = useWsStore.getState();
    try {
      const rawData = msg.data;
      if (!isValidStr(rawData)) return;
      const data = JSON.parse(rawData);
      if (data.returnKey) handleReturnKey(returnKeyMap, data);
      else handleNewMsg(data);
      updateCnt();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const connectWebsocket = useCallback(() => {
    const curSocket = socketRef.current;
    if (
      !curSocket ||
      ![WebSocket.OPEN, WebSocket.CONNECTING].includes(curSocket?.readyState)
    ) {
      if (curSocket) {
        curSocket.removeEventListener("open", onSocketOpen);
        curSocket.removeEventListener("error", onSocketClose);
        curSocket.removeEventListener("close", onSocketClose);
        curSocket.removeEventListener("message", onSocketMessage);
      }
      setConnStatus(SocketConnectionStatus.CONNECTING);
      const socket = new WebSocket(WEBSOCKET_URL);
      socket.addEventListener("open", onSocketOpen);
      socket.addEventListener("error", onSocketClose);
      socket.addEventListener("close", onSocketClose);
      socket.addEventListener("message", onSocketMessage);
      socketRef.current = socket;
    }
  }, []);

  useEffect(
    () => () => {
      clearInterval(heartIntervalRef.current);
      clearInterval(reconnectIntervalRef.current);
      // eslint-disable-next-line
      socketRef.current?.close();
    },
    []
  );

  return {
    connectWebsocket,
    sendMessage,
    connectionStatus
  };
};

export const SocketConnectionStatus = {
  IDLE: "IDLE",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  CLOSED: "CLOSED",
  RECONNECTING: "RECONNECTING"
};

export default useWebsocket;
