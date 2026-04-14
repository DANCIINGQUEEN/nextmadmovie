import styles from "./components.module.css";
export default function Modal2() {
  return (
    <>
      <input type="checkbox" id="modal2-toggle" className={styles.modalInput}/>
      <label htmlFor="modal2-toggle" className={styles.modalLabel}>Click Me!</label>
      <div className={styles.modal}>
        <div className={styles.modalContent}>Pure CSS Modal! No JS!</div>
      </div>
    </>
  );
}
