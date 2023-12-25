"use client";
import React, { useState, useEffect } from "react";
import styles from "./components.module.css";
export default function Modal({ render, button, multikill }) {
  const [showModal, setShowModal] = useState(false);
  //   const videoOption = useSelector((state) => state.videoOption);
  //   const isEnd = useSelector((state) => state.isEnd);

  const handleButtonClick = () => setShowModal((prev) => !prev);

  const closeModal = () => {
    setShowModal(false);
  };

  //   useEffect(() => {
  //     if (videoOption && !isEnd) {
  //       setShowModal(false);
  //     }
  //   }, [isEnd, videoOption]);

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={styles.modalButton}
        style={{ background: multikill }}
      >
        {React.cloneElement(button)}
      </button>
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.content}>{React.cloneElement(render)}</div>
          <button className={styles.close} onClick={closeModal}>
            ⨉
          </button>
        </div>
      )}
    </>
  );
}
