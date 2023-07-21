import styles from "./index.module.scss";
import cls from "classnames";
import { useCallback, useState } from "react";
import VerifyCode from "./verifyCode";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useConfigStore } from "../../store";
import useAutomaticLogin from "./automaticLogin";
import { persistLoginToken } from "../../utils";

function FormInput({ label, name, value, set, placeholder, children }) {
  const onChange = useCallback(
    (ev) => set((state) => ({ ...state, [name]: ev.target.value })),
    [name, set]
  );

  return (
    <div className={cls(styles.formInput, "flex-between")}>
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={onChange} />
      {children}
    </div>
  );
}

function LoginPage() {
  const [formInputs, setFormInputs] = useState({
    restaurantId: "",
    phoneNumber: "",
    code: ""
  });
  const [verifyCode, setVerifyCode] = useState("");
  const navigate = useNavigate();
  useAutomaticLogin();
  const loginBtnCbk = () => {
    const { code, restaurantId } = formInputs;
    if (verifyCode === code) {
      useConfigStore.getState().setRestaurantId(restaurantId);
      useAuthStore.getState().setAuth(true);
      navigate("/orderDisplay");
    }
  };

  return (
    <div className={cls("page-wrapper", styles.pageWrapper)}>
      <form className={styles.loginForm} action="#">
        <FormInput
          label="L'id du restaurant"
          name="restaurantId"
          value={formInputs.restaurantId}
          set={setFormInputs}
        />
        <FormInput
          label="Votre numéro du mobile"
          name="phoneNumber"
          value={formInputs.phoneNumber}
          set={setFormInputs}
        />
        <VerifyCode formState={formInputs} setCode={setVerifyCode} />
        {verifyCode && (
          <FormInput
            label="Code de vérification"
            name="code"
            value={formInputs.code}
            set={setFormInputs}
          />
        )}
        {verifyCode && <button onClick={loginBtnCbk}>Se connecter</button>}
      </form>
    </div>
  );
}

export default LoginPage;
