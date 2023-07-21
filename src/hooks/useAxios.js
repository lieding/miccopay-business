import { useRef, useState, useCallback } from "react";
import { AxiosInstance, isValidFunction, QueryStatus } from "../utils";

export default function useAxios(config) {
  const [status, setStatus] = useState(QueryStatus.IDLE);
  const resRef = useRef(null);

  const query = useCallback(
    (params) => {
      const { url, method = "GET" } = config || {};
      if (!url || !method) return;
      const { params: queryParams, data, cbk } = params;
      setStatus(QueryStatus.PENDING);
      AxiosInstance({
        method,
        url,
        params: queryParams,
        data:
          method.toUpperCase() === "POST" ? JSON.stringify(data || {}) : null
      })
        .then((data) => {
          resRef.current = data.data;
          setStatus(QueryStatus.SUCCEEDED);
          if (isValidFunction(cbk)) cbk(null, resRef.current);
        })
        .catch((err) => {
          resRef.current = err;
          setStatus(QueryStatus.FAILED);
          if (isValidFunction(cbk)) cbk(err);
        });
    },
    [config, setStatus, resRef]
  );

  return {
    status,
    isLoading: status === QueryStatus.PENDING,
    query,
    res: resRef.current
  };
}
