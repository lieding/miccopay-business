import { Modal, Button } from "react-materialize";
import styles from "./index.module.scss";
import CourseList from "./courseList";
import { MessageAction, OrderStatus } from "../../consts";
import cls from "classnames";

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
  if ([OrderStatus.PAID, OrderStatus.CONFIRMED].includes(order.orderStatus)) {
    const finishOrder = () => {
      sendMessage({
        ...order,
        action: MessageAction.Finish
      });
    };
    actions.unshift(
      <Button modal="close" node="button" waves="green" onClick={finishOrder}>
        Finaliser
      </Button>
    );
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
