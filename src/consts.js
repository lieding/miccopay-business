export const WEBSOCKET_URL =
  "wss://o3ddg3ei0j.execute-api.eu-west-3.amazonaws.com/production";

export const BASE_URL =
  "https://lx9l9yqrh6.execute-api.eu-west-3.amazonaws.com/default";

export const OrderStatus = {
  PAID: "PAID",
  CONFIRMED: "CONFIRMED",
  FINISHED: "FINISHED",
  CANCELED: "CANCELED"
};

export const MessageAction = {
  SetRestaurantId: "setRestaurantId",
  Confirm: "confirmOrder",
  Finish: "finishOrder",
  Cancel: "cancelOrder",
  ArchiveOrder: "archiveOrder"
};

export const QUERY_PATH = {
  BUSINESS_LOGIN: "/business-login"
};
