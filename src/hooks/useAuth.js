import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useConfigStore } from "../store";
import { getLoginToken } from "../utils";

function useAuth() {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => Boolean(state.auth));
  useEffect(() => {
    if (!isAuth) return navigate("/");
    const { restaurantId, setRestaurantId } = useConfigStore.getState();
    if (!restaurantId) {
      const {restaurantId: restId} = getLoginToken() || {};
      if (restId) 
        setRestaurantId(restId);
    }
  });
  return { isAuth };
}

export default useAuth;
