"use client";

import React from "react";
import styles from '@/styles/loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loading;
