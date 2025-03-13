'use client';

import styles from '../styles/Home.module.css';

const CouponMessage = ({ type, message }) => {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      {message}
    </div>
  );
};

export default CouponMessage;