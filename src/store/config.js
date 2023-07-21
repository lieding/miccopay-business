import { create } from "zustand";

const useConfigStore = create((set) => ({
  restaurantId: "wokgrill-91170-1",
  setRestaurantId: (restaurantId) => set({ restaurantId })
}));

export default useConfigStore;
