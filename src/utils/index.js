import { useConfigStore } from "../store";
import _instance from "./axios";
export * as InputValidators from "./inputValidator";

export function isValidStr(str) {
  return str && typeof str === "string";
}

export function isValidArray(arr) {
  return arr && Array.isArray(arr) && arr.length;
}

export function isValidObj(obj) {
  return obj && typeof obj === "object";
}

export function isValidFunction(fun) {
  return !!fun && typeof fun === "function";
}

export const AxiosInstance = _instance;

export function dateTimeFormatter(dateStr, nowTimestamp = Date.now()) {
  if (!dateStr || typeof dateStr !== "string") return "";
  const date = new Date(dateStr);
  const delta = nowTimestamp - date.getTime();
  const mins = Math.ceil(delta / 60000);
  if (mins > 60) return Math.floor(mins / 60) + " heures";
  return mins + " mins";
}

export const QueryStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED"
};

const LoginTokenKey = "LOGIN_TOKEN";

export function persistLoginToken() {
  const timestamp = Date.now();
  const { restaurantId } = useConfigStore.getState();
  const encoded = btoa(JSON.stringify({ timestamp, restaurantId }));
  localStorage.setItem(LoginTokenKey, encoded);
}

export function getLoginToken() {
  try {
    const encoded = localStorage.getItem(LoginTokenKey);
    if (!encoded) return null;
    const decoded = atob(encoded);
    const obj = JSON.parse(decoded);
    return obj;
  } catch (error) {
    console.error("fail during retrieving local login token", error);
    return null;
  }
}

export function clearLoginToken() {
  localStorage.removeItem(LoginTokenKey);
}
