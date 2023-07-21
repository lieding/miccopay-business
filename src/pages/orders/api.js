import { AxiosInstance } from "../../utils";
import { useConfigStore, useWsStore } from "../../store";

export async function getPendingOrders() {
  try {
    const { restaurantId } = useConfigStore.getState();
    const data = await AxiosInstance.get("/getPendingOrders", {
      params: { restaurantId }
    }).then((data) => data.data);
    useWsStore.getState().insertPendingOrders(data);
  } catch (error) {
    console.error(error);
  }
}
