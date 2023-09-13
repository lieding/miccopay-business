import { create } from "zustand";

const useConfigStore = create((set) => ({
  restaurantId: "",
  setRestaurantId: (restaurantId) => set({ restaurantId })
}));

export default useConfigStore;
