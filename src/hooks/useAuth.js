import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

function useAuth() {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => Boolean(state.auth));
  useEffect(() => {
    if (!isAuth) navigate("/");
  }, [isAuth, navigate]);
}

export default useAuth;
