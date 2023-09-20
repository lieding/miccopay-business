import styles from "./index.module.scss";
import { isValidArray } from "../../utils";
import cls from "classnames";

function Course({ name, count, price }) {
  const subTotal = (price * (count || 1)).toFixed(2);
  return (
    <div className={styles.course}>
      {count > 1 && <span>{count} x</span>}
      <span className={cls(styles.name, "course-list-item-name")} title={name}>
        {name}
      </span>
      <span>{subTotal}€</span>
    </div>
  );
}

export default function CourseList({ courses, tip }) {
  return (
    <div className={styles.courseList}>
      {isValidArray(courses) &&
        courses.map((course) => <Course key={course.courseKey} {...course} />)}

      {tip > 0 && (
        <div className={styles.course}>
          <span className={styles.name}>Pourboire</span>
          <span className={styles.tip}>{tip}€</span>
        </div>
      )}
    </div>
  );
}
