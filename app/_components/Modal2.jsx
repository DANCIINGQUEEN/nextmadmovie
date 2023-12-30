import styles from "./components.module.css";
export default function Modal2() {
  return (
    <>
      <input type="checkbox" className={styles.modalInput}/>
      <label for="button" className={styles.modalLabel}>Click Me!</label>
      <div className={styles.modal}>
        <div className={styles.modalContent}>Pure CSS Modal! No JS!</div>
      </div>
    </>
  );
}
