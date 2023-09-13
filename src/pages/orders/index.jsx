import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWebsocket, useAuth } from "../../hooks";
import { getPendingOrders } from "./api";
import { useAuthStore, useWsStore } from "../../store";
import styles from "./index.module.scss";
import { dateTimeFormatter } from "../../utils";
import cls from "classnames";
import { OrderStatus } from "../../consts";
import TopSummaryRow from "./topSummaryRow";
import OrderModal from "./orderModal";
import CourseList from "./courseList";
import ConnectionStatusDisplay from "./connectionStatusDisplay";
import "./index.css";
import { Logo4OrderPage } from '../../components/icons'

function orderCountSelector(state) {
  return {
    paidCnt: state.paidOrderCnt,
    finishedCnt: state.finishedOrderCnt,
    unPaidCnt: state.unPaidOrderCnt,
    tableMap: state.tableMap,
    tableAmtMap: state.tableAmtMap,
    confirmedCnt: state.confirmedOrderCnt,
  };
}

function getOrderCls(orderStatus) {
  if (orderStatus) {
    switch (orderStatus) {
      case OrderStatus.PAID:
        return styles.paid;
      case OrderStatus.CONFIRMED:
        return styles.confirmed;
      case OrderStatus.FINISHED:
        return styles.finished;
      case OrderStatus.CANCELED:
        return styles.canceled;
      case OrderStatus.UNPAID:
        return styles.unpaid;
      case OrderStatus.REFUNDED:
        return styles.canceled;
      default:
    }
  }
  return "";
}

function Order({ order, nowTimestamp, openModal }) {
  const { orderStatus, updatedAt, orders: courses, amount } = order;
  const timeElapsed = dateTimeFormatter(updatedAt, nowTimestamp);
  const bgCls = getOrderCls(orderStatus);
  const onClick = () => openModal(order);

  return (
    <div className={cls(styles.orderWrapper, bgCls)} onClick={onClick}>
      <div className={cls(styles.total, "flex-between")}>
        <span>Total</span>
        <span>{amount}€</span>
      </div>
      <CourseList courses={courses} tip={order.tip} />
      <div>
        <span className={styles.timeElapsed}>il y a {timeElapsed}</span>
      </div>
    </div>
  );
}

function Table({ orders, table, amountCnt, ...params }) {
  return (
    <div className={styles.table}>
      <div className={styles.tableInfo}>
        <div>Table {table}</div>
        { amountCnt && <div>{amountCnt}€</div> }
      </div>
      <div className={styles.content}>
        {orders.map((order) => (
          <Order key={order.id} order={order} {...params} />
        ))}
      </div>
    </div>
  );
}

function OrderDisplayPage() {
  const { isAuth } = useAuth();
  const { connectWebsocket, sendMessage, connectionStatus } = useWebsocket({
    connectedCbk: getPendingOrders
  });
  const {
    paidCnt,
    tableMap,
    finishedCnt,
    tableAmtMap,
    unPaidCnt,
    confirmedCnt,
  } = useWsStore(orderCountSelector);
  const [nowTimestamp, setTimestamp] = useState(() => Date.now());

  const [isModalOpen, toggleModal] = useState(false);
  const modalConfigRef = useRef({});
  const openModal = useCallback(
    (order) => {
      const closeModal = () => toggleModal(false);
      modalConfigRef.current = { order, closeModal };
      toggleModal(true);
    },
    [toggleModal, modalConfigRef]
  );

  useEffect(() => {
    // getPendingOrders();
    let intertvalId;
    if (isAuth) {
      connectWebsocket();
      intertvalId = setInterval(() => setTimestamp(Date.now()), 60 * 1000);
    }
    return () => clearInterval(intertvalId);
  }, [isAuth]);

  const tableCnt = tableMap.size;
  const tableKeys = useMemo(() => Array.from(tableMap.keys()).sort(), [
    tableCnt,
    tableMap
  ]);

  return (
    <div className={styles.pageWrapper}>
      <div className={cls('textAlign', styles.logo4SmallScreen)}>
        <Logo4OrderPage />
      </div>
      <TopSummaryRow
        paidCnt={paidCnt}
        tableCnt={tableCnt}
        finishedCnt={finishedCnt}
        unPaidCnt={unPaidCnt}
        confirmedCnt={confirmedCnt}
      />
      <div className={styles.tableWrapper}>
        {tableKeys.map((table) => (
          <Table
            key={table}
            table={table}
            orders={tableMap.get(table)}
            nowTimestamp={nowTimestamp}
            openModal={openModal}
            amountCnt={tableAmtMap[table]}
          />
        ))}
      </div>
      <OrderModal
        isOpen={isModalOpen}
        config={modalConfigRef.current}
        sendMessage={sendMessage}
      />
      <ConnectionStatusDisplay connectionStatus={connectionStatus} />
    </div>
  );
}

export default OrderDisplayPage;
