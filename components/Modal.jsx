"use client";
import React, { useState, useEffect } from "react";
import styles from "./components.module.css";
export default function Modal({ render, button, multikill }) {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => setShowModal((prev) => !prev);

  const closeModal = () => {
    setShowModal(false);
  };

  // const isPlaying = localStorage.getItem("isPlaying");
  // useEffect(() => {
  //   console.log(isPlaying);
  //   !isPlaying &&setShowModal(false);
  //    setShowModal(isPlaying === "true");
  // }, [isPlaying]);

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
