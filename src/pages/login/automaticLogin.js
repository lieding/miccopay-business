import { useEffect } from "react";
import { useAxios } from "../../hooks";
import { QUERY_PATH } from "../../consts";
import { getLoginToken, clearLoginToken } from "../../utils";
import { useConfigStore, useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";

const QueryConfig = {
  url: QUERY_PATH.BUSINESS_LOGIN
};

function loginQueryCbk(restauratId, navigate) {
  return function (err, data) {
    const { setAuth } = useAuthStore.getState();
    if (err) return setAuth(false);
    useConfigStore.getState().setRestaurantId(restauratId);
    setAuth(true);
    navigate("/orderDisplay");
  };
}

export default function useAutomaticLogin() {
  const navigate = useNavigate();
  const { query } = useAxios(QueryConfig);

  useEffect(() => {
    const { timestamp: loginToken, restaurantId } = getLoginToken() || {};
    if (!loginToken || !restaurantId) return clearLoginToken();
    const cbk = loginQueryCbk(restaurantId, navigate);
    const params = {
      loginToken,
      restaurantId
    };
    query({ params, cbk });
  }, []);
}
