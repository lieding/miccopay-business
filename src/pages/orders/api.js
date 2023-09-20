import { AxiosInstance, numberMutiplyBy100 } from "../../utils";
import { useConfigStore, useWsStore } from "../../store";
import { QUERY_PATH } from "../../consts";
import { setStatus2Refunded } from '../../hooks/useWebsocket'

export async function getPendingOrders() {
  try {
    const { restaurantId } = useConfigStore.getState();
    if (!restaurantId) return;
    const data = await AxiosInstance.get(QUERY_PATH.GET_PENDING_ORDERS, {
      params: { restaurantId }
    }).then((data) => data.data);
    useWsStore.getState().insertPendingOrders(data);
  } catch (error) {
    console.error(error);
  }
}

export async function refundOrder (order, amount) {
  try {
    const { restaurantId } = useConfigStore.getState();
    if (!restaurantId) return;
    const { orderId, id } = order;
    amount = amount ? numberMutiplyBy100(amount) : undefined;
    await AxiosInstance.post(QUERY_PATH.REFUND_ORDER, {
      restaurantId, orderId, id, amount, 
    });
    setStatus2Refunded(order);
  } catch (err) {
    console.error(err);
    window.M.toast({ html: "Échoué au remboursement. Réssayez" })
  }
}
