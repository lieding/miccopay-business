import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../hooks";
import { isValidObj } from "../../utils";
import { InputValidators } from "../../utils";
import { Button } from "react-materialize";
import { QUERY_PATH } from "../../consts";

const CountDownSeconds = 30;

const QueryConfig = {
  url: QUERY_PATH.BUSINESS_LOGIN
};

export default function VerifyCodeBtn({ formState, setCode }) {
  const [active, toggleActive] = useState(true);
  const [countDownSec, setCntDownSec] = useState(CountDownSeconds);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), [intervalRef]);
  const { res, query } = useAxios(QueryConfig);

  useEffect(() => {
    if (isValidObj(res) && res.code) setCode(res.code);
  }, [res, setCode]);

  const onClick = () => {
    const { restaurantId, phoneNumber } = formState;
    const valid = InputValidators.phoneNumber(phoneNumber);
    if (!active || !valid || !restaurantId) return;
    toggleActive(false);
    query({ params: formState });
    setCode("");
    intervalRef.current = setInterval(() => {
      setCntDownSec((sec) => {
        if (sec > 0) {
          return sec - 1;
        }
        toggleActive(true);
        clearInterval(intervalRef.current);
        return CountDownSeconds;
      });
    }, 1000);
  };

  return (
    <Button disabled={!active} onClick={onClick}>
      {active ? "Envoyer" : `Déja envoyé ${countDownSec}`}
    </Button>
  );
}
