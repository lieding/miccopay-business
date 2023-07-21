import styles from "./index.module.scss";
import { isValidArray } from "../../utils";
import cls from "classnames";

function Course({ name, count, price }) {
  return (
    <div className={styles.course}>
      <span className={cls(styles.name, "course-list-item-name")} title={name}>
        {name}
      </span>
      <span>{price}€</span>
      {count > 1 && <span>* {count}</span>}
    </div>
  );
}

export default function CourseList({ courses, tip }) {
  return (
    <div className={styles.courseList}>
      {isValidArray(courses) &&
        courses.map((course) => <Course key={course.courseKey} {...course} />)}

      {tip && (
        <div className={styles.course}>
          <span className={styles.name}>Pourboire</span>
          <span className={styles.tip}>{tip}€</span>
        </div>
      )}
    </div>
  );
}
