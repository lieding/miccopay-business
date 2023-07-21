import axios from "axios";
import { BASE_URL } from "../consts";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: BASE_URL
});

// Alter defaults after instance has been created
instance.defaults.headers.common["Content-Type"] = "application/json";

export default instance;
