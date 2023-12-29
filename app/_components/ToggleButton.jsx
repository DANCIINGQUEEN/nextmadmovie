"use client";
import styles from "./components.module.css";
export default function ToggleButton() {
  const [isToggle, setIsToggle] = useState(false);
  const handleChange = () => {
    setIsToggle((prev) => !prev);
  };
  return (
    <div className={styles.toggleWrapper}>
      <span style={{ marginRight: "20px" }}>영상이 끝나면 영상 닫기</span>
      <span className={styles.toggle} isOn={isToggle} onClick={handleChange}/>
    </div>
  );
}
