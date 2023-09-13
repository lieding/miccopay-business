export const WEBSOCKET_URL =
  "wss://o3ddg3ei0j.execute-api.eu-west-3.amazonaws.com/production";

export const IS_PROD = Boolean(process.env.IS_PROD);

export const BASE_URL = IS_PROD ?
  "https://lx9l9yqrh6.execute-api.eu-west-3.amazonaws.com/default" : 
  "https://ne4tzrc9e9.execute-api.eu-west-3.amazonaws.com/dev";

export const OrderStatus = {
  PAID: "PAID",
  CONFIRMED: "CONFIRMED",
  FINISHED: "FINISHED",
  CANCELED: "CANCELED",
  UNPAID: 'UNPAID',
  ARCHIVED: 'ARCHIVED',
  REFUNDED: 'REFUNDED'
};

export const MessageAction = {
  SetRestaurantId: "setRestaurantId",
  Confirm: "confirmOrder",
  Finish: "finishOrder",
  Cancel: "cancelOrder",
  ArchiveOrder: "archiveOrder",
  Pay: "payOrder"
};

export const QUERY_PATH = {
  BUSINESS_LOGIN: "/business-login",
  GET_PENDING_ORDERS: "/getPendingOrders",
  REFUND_ORDER: "/refund-order",
};
