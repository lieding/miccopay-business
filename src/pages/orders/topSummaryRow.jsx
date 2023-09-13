import styles from "./index.module.scss";
import cls from "classnames";

function TopSummaryRow({ paidCnt, tableCnt, finishedCnt, unPaidCnt, confirmedCnt }) {
  return (
    <div className={styles.topSummaryRow}>
      {/* <div>
        <span className={styles.title}>Table</span>
        <span>{tableCnt}</span>
      </div> */}
      <div>
        <div className={cls(styles.unpaid, styles.ball)}></div>
        <span className={cls(styles.title, styles.unpaidTitle)}>Payé à la caisse</span>
        <span>{unPaidCnt}</span>
      </div>
      <div>
        <div className={cls(styles.paid, styles.ball)}></div>
        <span className={styles.title}>Payé</span>
        <span>{paidCnt}</span>
      </div>
      <div>
        <div className={cls(styles.confirmed, styles.ball)}></div>
        <span className={styles.title}>Imprimé</span>
        <span>{confirmedCnt}</span>
      </div>
      <div>
        <div className={cls(styles.finished, styles.ball)}></div>
        <span className={styles.title}>Finalisé</span>
        <span>{finishedCnt}</span>
      </div>
    </div>
  );
}

export default TopSummaryRow;
