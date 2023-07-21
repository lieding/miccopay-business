import { create } from "zustand";
import { persistLoginToken, clearLoginToken } from "../utils";

const useAuthStore = create((set) => ({
  auth: false,
  setAuth: (auth = true) => {
    set({ auth });
    if (auth) persistLoginToken();
    else clearLoginToken();
  }
}));

export default useAuthStore;
