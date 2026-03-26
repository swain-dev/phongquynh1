'use client';

import { useState } from 'react';

export default function Envelope({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (onOpen) onOpen();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="envelope-wrapper">
      <div className="envelope-shadow"></div>
      
      <div 
        className={`envelope-container ${isOpen ? 'open' : 'close'}`}
        onClick={handleClick}
      >
        <div className="flap"></div>
        <div className="pocket"></div>
        
        {!isOpen && (
          <div className="wax-seal">
            &hearts;
          </div>
        )}
        
        <div className="letter">
          {/* We will use a placeholder image for the letter inner content */}
          <img 
            src="/images/img_1.jpg" 
            alt="Wedding Couple"
            className="letter-image"
          />
        </div>
        
        <div className="front"></div>
        
        {!isOpen && (
          <div style={{ position: 'absolute', bottom: '25px', width: '100%', textAlign: 'center', color: '#8bacc0', fontSize: '13px', fontStyle: 'italic', zIndex: 11, animation: 'pulse 2s infinite' }}>
            Chạm túi thư để mở thiệp...
          </div>
        )}

        <div className="hearts">
          <div className="heart a1"></div>
          <div className="heart a2"></div>
          <div className="heart a3"></div>
        </div>
      </div>
    </div>
  );
}
