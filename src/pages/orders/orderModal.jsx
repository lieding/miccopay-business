import { Modal, Button } from "react-materialize";
import styles from "./index.module.scss";
import CourseList from "./courseList";
import { MessageAction, OrderStatus } from "../../consts";
import { refundOrder } from './api'
import cls from "classnames";
import { useEffect, useRef, useState } from "react";

function Content({ order }) {
  return (
    <div className={cls(styles.modalContent, "order-modalContent-mini")}>
      <div className="textAlign">
        <div>Vous avez bien servi</div>
        <h5 className="bold">Table {order.table}</h5>
      </div>
      <div className={styles.right}>
        <div>AVEC</div>
        <CourseList courses={order.orders} tip={order.tip} />
      </div>
    </div>
  );
}

function Refund ({ order, visible, closeModal }) {
  const [ expanded, setExpanded ] = useState(false)
  const ref = useRef(null);
  const submitHandler = (ev) => {
    ev.preventDefault();
    const el = ref.current
    if (el) {
      const value = Number(el.value);
      if (value < 0 || value > order.amount)
        return el.setCustomValidity(`le montant dois être supérieur à 0 et inférieur à ${order.amount}`);
      refundOrder(order, value !== order.amount ? value : undefined);
      closeModal();
    }
  }
  useEffect(() => setExpanded(false), [visible]);
  if (!expanded) {
    return <Button node="button" className="refund" onClick={() => setExpanded(true)}>REMBOURSER</Button>
  }
  return <form className="refundForm" onSubmit={submitHandler}>
    <input
      defaultValue={order.amount}
      required
      ref={el => ref.current = el}
    />
    <span>€</span>
    <Button node="button" small>Confirmer</Button>
  </form>
}

export default function OrderModal({ isOpen, config, sendMessage }) {
  if (!isOpen) return null;
  const { closeModal, order } = config;
  const archiveOrder = () => {
    sendMessage({
      ...order,
      action: MessageAction.ArchiveOrder
    });
  };
  const actions = [
    <Button flat modal="close" node="button" onClick={archiveOrder}>
      Archiver
    </Button>
  ];
  if (order.orderStatus === OrderStatus.UNPAID) {
    const payOrder = () => sendMessage({ ...order, action: MessageAction.Pay });
    actions.unshift(
      <Button modal="close" node="button" waves="green" onClick={payOrder}>
        Payer
      </Button>
    );
  } else if (order.orderStatus === OrderStatus.PAID) {
    const confirmOrder = () => sendMessage({ ...order, action: MessageAction.Confirm });
    actions.unshift(
      <Button modal="close" node="button" waves="green" onClick={confirmOrder}>
        Imprimer
      </Button>
    );
  }
  if (checkShowCancelBtn(order.orderStatus)) {
    const finishOrder = () => {
      sendMessage({
        ...order,
        action: MessageAction.Finish
      });
    };
    actions.push(
      <Button modal="close" node="button" onClick={finishOrder}>
        Finaliser
      </Button>
    );
  }
  if (checkShowRefundBtn(order)) {
    actions.push(<Refund order={order} visible={isOpen} closeModal={closeModal} />);
  }
  return (
    <Modal
      actions={actions}
      open={true}
      options={{
        dismissible: true,
        endingTop: "10%",
        inDuration: 250,
        onCloseEnd: closeModal,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: "4%"
      }}
    >
      <Content order={order} />
    </Modal>
  );
}

function checkShowRefundBtn (order) {
  return order.orderId && [
      OrderStatus.PAID,
      OrderStatus.CONFIRMED,
      OrderStatus.FINISHED,
      OrderStatus.CANCELED
    ].includes(order.orderStatus);
}

function checkShowCancelBtn (orderStatus) {
  return [
    OrderStatus.PAID,
    OrderStatus.CONFIRMED,
    OrderStatus.UNPAID,
  ].includes(orderStatus);
}
