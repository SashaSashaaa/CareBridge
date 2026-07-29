import React from 'react';
import './style.css';

const SupportButton = () => {
  return (
    <a 
      href="https://www.paypal.com/donate/?hosted_button_id=MBL7V3GK9LK6S"
      target="_blank" 
      rel="noopener noreferrer"
      className="sticky-support-btn"
    >
      <span className="btn-text">Підтримати нас</span>
      <span className="btn-arrow">→</span>
    </a>
  );
};

export default SupportButton;