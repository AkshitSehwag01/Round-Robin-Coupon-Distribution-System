'use client';

import { useState } from 'react';
import styles from '../styles/Home.module.css';
import CouponMessage from './CouponMessage';

const CouponClaimForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCouponClaim = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/claimCoupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to claim coupon');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.claimContainer}>
      <button 
        className={styles.claimButton}
        onClick={handleCouponClaim}
        disabled={loading}
      >
        {loading ? 'Claiming...' : 'Claim Your Coupon'}
      </button>

      {error && <CouponMessage type="error" message={error} />}
      {result && <CouponMessage type="success" message={result.message} />}
    </div>
  );
};

export default CouponClaimForm;