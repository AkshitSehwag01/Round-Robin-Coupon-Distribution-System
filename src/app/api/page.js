'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import CouponClaimForm from '../components/CouponClaimForm';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Round-Robin Coupon Distribution
        </h1>

        <div className={styles.description}>
          <p>Get your unique coupon code below</p>
        </div>

        {mounted && <CouponClaimForm />}
      </main>

      <footer className={styles.footer}>
        <p>Protected by IP and Cookie tracking</p>
      </footer>
    </div>
  );
}