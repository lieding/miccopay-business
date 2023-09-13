import styles from "./index.module.scss";
import cls from "classnames";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useConfigStore } from "../../store";
import useAutomaticLogin, { pwdLogin } from "./automaticLogin";
import { MiccoLogo } from '../../components/icons'


function FormInput({ label, name, value, set, placeholder, children, type }) {
  const onChange = useCallback(
    (ev) => set((state) => ({ ...state, [name]: ev.target.value })),
    [name, set]
  );

  return (
    <div className={cls(styles.formInput, "flex-between")}>
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={onChange} type={type} />
      {children}
    </div>
  );
}

function LeftPartOnBigScreen () {
  return <div className={cls(styles.leftPart, 'flex-center')}>
    <div>
      <span className={styles.title}>Bienvenue!</span>
      <span className={styles.subtitle}>Faites connexions et consultez vos transactions</span>
    </div>
    <div className={styles.logo}><MiccoLogo fillColor="#FFF" /></div>
  </div>
}

function LoginPage() {
  const [formInputs, setFormInputs] = useState({
    restaurantId: "",
    password: ""
  });
  const [ btnDisabled, setBtnDisabled ] = useState(false);
  const navigate = useNavigate();
  useAutomaticLogin({ setBtnDisabled });
  const loginBtnCbk = () => {
    const { password, restaurantId } = formInputs;
    if (!password || !restaurantId)
      return;
    const onSuccess = () => {
      useConfigStore.getState().setRestaurantId(restaurantId);
      useAuthStore.getState().setAuth(true);
      navigate("/orderDisplay");
    };
    pwdLogin(restaurantId, password)
      .then(onSuccess)
      .catch(err => {
        console.error(err);
        if (window.M)
          window.M.toast({ html: "Échoué à l'authentication. Réssayez" })
      })
      .finally(() => setBtnDisabled(false));
    setBtnDisabled(true);
  };

  return (
    <div className={cls("page-wrapper", styles.pageWrapper)}>
      <LeftPartOnBigScreen />
      <form className={styles.loginForm} action="#">
        <div className={cls('textAlign', styles.logo)}>
          <MiccoLogo />
        </div>
        <div className={styles.label}>ID du Restaurant</div>
        <FormInput
          placeholder="Entrez votre ID du restaurant"
          name="restaurantId"
          value={formInputs.restaurantId}
          set={setFormInputs}
        />
        <div className={styles.label}>Mot de passe</div>
        <FormInput
          placeholder="Entrez votre mot de passe"
          name="password"
          value={formInputs.password}
          set={setFormInputs}
          type="password"
        />
        <div className="textAlign">
          <button disabled={btnDisabled} className={styles.loginBtn} onClick={loginBtnCbk}>
            { btnDisabled ? "Attention ..." : "Se connecter" }
          </button>
        </div>
        <div className={styles.auxilary}>
          <div><a href={generateMailtoHref(MailType.FORGOT_PWD)}>Mot de passe oublié</a></div>
          <div><a href={generateMailtoHref(MailType.PARTNER)}>Devenir Restaurant partenaire</a></div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

const MailType = {
  FORGOT_PWD: 'FORGOT_PWD',
  PARTNER: 'PARTNER'
}

function generateMailtoHref (mailType, to = 'hello@getmicco.com') {
  let subject = '', body = '';
  if (mailType === MailType.FORGOT_PWD) {
    subject = "J'ai oublié mon mot de passe";
  } else {
    subject = "Je souhaites devenir le partenaire";
  }
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
