import { useEffect } from "react";
import { useAxios } from "../../hooks";
import { QUERY_PATH } from "../../consts";
import { getLoginToken, clearLoginToken } from "../../utils";
import { useConfigStore, useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import AxiosInstance from '../../utils/axios'

const QueryConfig = {
  url: QUERY_PATH.BUSINESS_LOGIN
};

function loginQueryCbk(restauratId, navigate, setBtnDisabled) {
  return function (err, data) {
    const { setAuth } = useAuthStore.getState();
    if (err) {
      setBtnDisabled(false);
      return setAuth(false);
    }
    useConfigStore.getState().setRestaurantId(restauratId);
    setAuth(true);
    navigate("/orderDisplay");
  };
}

export default function useAutomaticLogin({ setBtnDisabled }) {
  const navigate = useNavigate();
  const { query } = useAxios(QueryConfig);

  useEffect(() => {
    const { timestamp: loginToken, restaurantId } = getLoginToken() || {};
    if (!loginToken || !restaurantId) return clearLoginToken();
    const cbk = loginQueryCbk(restaurantId, navigate, setBtnDisabled);
    const params = {
      loginToken,
      restaurantId
    };
    query({ params, cbk });
    setBtnDisabled?.(true);
  }, []);
}

export function pwdLogin (restaurantId, password) {
  return AxiosInstance.get(
    QUERY_PATH.BUSINESS_LOGIN,
    { params: { restaurantId, password } }
  ).then(data => data.data);
}
 