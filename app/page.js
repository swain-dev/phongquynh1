'use client';

import React, { useState, useRef, useEffect } from 'react';
import Envelope from './Envelope';
import AudioPlayer from './AudioPlayer';

function FadeInSection({ children, delay = '0s' }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(currentRef);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div className={`scroll-fade ${isVisible ? 'is-visible' : ''}`} ref={domRef} style={{ transitionDelay: delay, width: '100%' }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [isGiftPopupOpen, setIsGiftPopupOpen] = useState(false);
  const autoScrollRef = useRef(null);

  // Dynamically scale envelope based on REAL available viewport height
  useEffect(() => {
    const setEnvelopeScale = () => {
      const h = window.innerHeight;
      let scale;
      if (h >= 800) scale = 1;
      else if (h >= 700) scale = 0.85;
      else if (h >= 600) scale = 0.7;
      else scale = 0.55;
      document.documentElement.style.setProperty('--envelope-scale', scale);
    };
    setEnvelopeScale();
    window.addEventListener('resize', setEnvelopeScale);
    return () => window.removeEventListener('resize', setEnvelopeScale);
  }, []);

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => stopAutoScroll();
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    window.addEventListener('mousedown', handleUserInteraction);
    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      stopAutoScroll();
    };
  }, []);

  const startAutoScroll = () => {
    const scrollStep = () => {
      window.scrollBy(0, 0.6);
      autoScrollRef.current = requestAnimationFrame(scrollStep);
      if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
        stopAutoScroll();
      }
    };
    autoScrollRef.current = requestAnimationFrame(scrollStep);
  };

  const handleOpen = () => {
    setIsOpened(true);
    const audio = document.getElementById('bg-music');
    if (audio && audio.paused) {
      audio.play().catch(e => console.log("Audio autoplay blocked by browser policy:", e));
    }
    setTimeout(() => {
      startAutoScroll();
    }, 1500); // Wait for envelope to open before scrolling
  };

  return (
    <main className="invitation-page">
      <AudioPlayer />
      
      {/* FULLSCREEN INITIAL VIEW */}
      <div 
        style={{
          width: '100%', 
          height: '100dvh',
          position: 'relative',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          transition: 'all 1s ease',
          zIndex: 10
        }}
      >
        {/* Floral Top Left */}
        <img 
          src="https://cdn.pixabay.com/photo/2016/11/10/18/31/flowers-1814896_1280.png" 
          alt="Floral" 
          style={{ position: 'absolute', top: '-20px', left: '-50px', width: '200px', opacity: 0.6, transform: 'rotate(15deg)', filter: 'hue-rotate(330deg) saturate(0.8)', clipPath: 'inset(20px 50px 0 50px)' }} 
        />

        {/* Top Text Bar */}
        <div style={{ position: 'absolute', top: '25px', width: '100%', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#a87b7a', letterSpacing: '2px', padding: '0 20px', fontWeight: 600 }}>
          <span>SAVE</span>
          <span style={{ color: '#d49a99', fontSize: '8px', alignSelf: 'center' }}>&#x2022;</span>
          <span>THE</span>
          <span style={{ color: '#d49a99', fontSize: '8px', alignSelf: 'center' }}>&#x2022;</span>
          <span>DATE</span>
        </div>

        {/* Main Title */}
        <h1 style={{ position: 'absolute', top: '90px', fontFamily: "'Momo Signature', cursive", fontSize: '32px', color: '#966c6b', fontWeight: 400, margin: 0, textShadow: '1px 1px 2px rgba(180,130,130,0.1)' }}>
          Wedding Invitation
        </h1>

        {/* Bottom Section */}
        <div style={{ position: 'absolute', bottom: '4%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Calligraphy Names Moved Down Here */}
          <h2 style={{ fontFamily: "'Momo Signature', cursive", fontSize: '26px', color: '#8c6261', fontWeight: 400, margin: '0 0 35px 0', letterSpacing: '0px', textShadow: '1px 1px 3px rgba(180,130,130,0.2)', whiteSpace: 'nowrap' }}>
            Trúc Quỳnh <span style={{fontSize: '16px', color: '#d2a7a6', margin: '0 5px', verticalAlign: 'middle'}}>&hearts;</span> Văn Phong
          </h2>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', letterSpacing: '3px', color: '#a37c7b', textTransform: 'uppercase', margin: '0 0 5px 0' }}>
            Trân Trọng Kính Mời
          </h2>
          
          {/* Shadow line under text */}
          <div style={{ width: '220px', height: '10px', background: 'radial-gradient(ellipse at center, rgba(180,130,130,0.15) 0%, transparent 60%)', marginBottom: '15px' }}></div>
          
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '16px', color: '#ad8685', textAlign: 'center', lineHeight: '1.6', marginBottom: '18px', padding: '0 20px' }}>
            Tới dự bữa tiệc thân mật, chung vui cùng<br/>
            gia đình hai bên chúng mình vào lúc
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', color: '#c29a99', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", color: '#8a5d5c', fontWeight: 600 }}>10:00</span>
            <span style={{ fontSize: '20px', color: '#eac4c3' }}>|</span>
            <span style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", color: '#8a5d5c', fontWeight: 600 }}>CHỦ NHẬT</span>
            <span style={{ fontSize: '20px', color: '#eac4c3' }}>|</span>
            <span style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", color: '#8a5d5c', fontWeight: 600 }}>26.04</span>
          </div>

          <p style={{ fontSize: '15px', color: '#c29a99', fontStyle: 'italic', marginBottom: '18px' }}>
            (Nhằm ngày 10 tháng 03 năm Ất Tỵ)
          </p>

          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '15px', color: '#9c7473', textAlign: 'center', lineHeight: '1.5', fontWeight: 500, margin: 0, padding: '0 20px' }}>
            Tại gia đình nhà gái:<br/>
            Số 41, Tổ dân phố Trần Phú, Xã Cổ Lễ, Tỉnh Ninh Bình
          </p>
        </div>

        {/* Floral Bottom Right */}
        <img 
          src="https://cdn.pixabay.com/photo/2016/11/10/18/31/flowers-1814896_1280.png" 
          alt="Floral" 
          style={{ position: 'absolute', bottom: '15%', right: '-60px', width: '200px', opacity: 0.6, transform: 'rotate(-165deg)', filter: 'hue-rotate(330deg) saturate(0.8)', clipPath: 'inset(20px 0 0 60px)' }} 
        />
      </div>

      {/* THE ENVELOPE ITSELF */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100dvh', pointerEvents: 'none', zIndex: 20 }}>
        {/* Re-enable pointer events just for the envelope area so it can be clicked */}
        <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
          {/* We use a wrapper with fixed top positioning to match the envelope CSS expectations while keeping it visually centered. */}
          <Envelope onOpen={handleOpen} />
        </div>
      </div>

      {/* DETAILED CONTENT REVEALED AFTER OPENING */}
      <div 
        className={`fade-in-section ${isOpened ? 'is-visible' : ''}`} 
        style={{ 
          marginTop: '0px',
          width: '100%', 
          backgroundColor: 'transparent',
          padding: '60px 20px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 30, // Above the envelope when scrolled down
          display: isOpened ? 'flex' : 'none', // Hide entirely from flow until opened
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        
        {/* HERO IMAGE */}
        <FadeInSection>
          <div style={{ width: '100%', borderRadius: '15px', overflow: 'hidden', marginBottom: '35px', boxShadow: '0 10px 25px rgba(180, 130, 130, 0.15)' }}>
            <img 
              src="/images/img_2.jpg" 
              alt="Couple Hero" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </FadeInSection>

        <FadeInSection delay="0.2s">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#9c7473', textAlign: 'center', marginBottom: '45px', fontStyle: 'italic', padding: '0 20px', lineHeight: '1.6' }}>
            "Tình yêu không phải là nhìn nhau,<br/>mà là cùng nhau nhìn về một hướng."
          </p>
        </FadeInSection>

        {/* INVITATION LETTER TEXT */}
        <FadeInSection>
          <div style={{ position: 'relative', padding: '45px 25px 35px 25px', backgroundColor: '#fffdfd', borderRadius: '15px', border: '1px solid #faeaea', marginBottom: '50px', width: '100%', textAlign: 'center', boxShadow: '0 8px 25px rgba(180, 130, 130, 0.08)' }}>
            
            {/* Decorative Quote Marks */}
            <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '60px', color: '#f0dcdc', fontFamily: "'Playfair Display', serif", lineHeight: 1, opacity: 0.6 }}>"</div>
            <div style={{ position: 'absolute', bottom: '0px', right: '20px', fontSize: '60px', color: '#f0dcdc', fontFamily: "'Playfair Display', serif", lineHeight: 1, opacity: 0.6 }}>"</div>

            <h3 style={{ position: 'relative', zIndex: 1, fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#b97a78', marginBottom: '25px', letterSpacing: '1px', fontStyle: 'italic' }}>Lời Ngỏ</h3>
            
            <div style={{ position: 'relative', zIndex: 1, fontFamily: "'Quicksand', sans-serif", fontSize: '15px', lineHeight: '1.9', color: '#9c7473', fontWeight: 500 }}>
              <p style={{ margin: '0 0 15px 0' }}>
                Tình yêu là một hành trình kỳ diệu, nơi hai người xa lạ bỗng hóa thành trọn vẹn của đời nhau.
              </p>
              <p style={{ margin: '0 0 15px 0' }}>
                Thật may mắn vì trong vô vàn ngã rẽ của cuộc đời, chúng mình đã tìm thấy nhau. Sau quãng thời gian được cùng chia sẻ những buồn vui, hai đứa đã quyết định nắm tay nhau bước sang một ngã rẽ mới, nơi có một bến đỗ bình yên mang tên "Gia đình".
              </p>
              <p style={{ margin: '0 0 25px 0' }}>
                Và ngày vui ấy sẽ chẳng thể nào trọn vẹn nếu thiếu đi nụ cười, sự hiện diện cùng lời chúc tốt đẹp từ bạn. Đó mãi mãi là món quà vô giá và là minh chứng tuyệt vời nhất cho tình yêu của chúng mình.
              </p>
              <p style={{ fontFamily: "'Momo Signature', cursive", fontSize: '28px', color: '#a37c7b', margin: '0', display: 'inline-block' }}>
                Trân trọng cảm ơn!
              </p>
            </div>
          </div>
        </FadeInSection>

        {/* FAMILY INFO */}
        <FadeInSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 10px', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#8a5d5c', marginBottom: '10px', borderBottom: '1px solid #eac4c3', paddingBottom: '5px', display: 'inline-block' }}>NHÀ GÁI</h4>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '15px', color: '#ad8685', lineHeight: '1.6' }}>
                Ông: Dương Quý Sinh<br/>
                Bà: Vũ Thị Hằng
              </p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#8a5d5c', marginBottom: '10px', borderBottom: '1px solid #eac4c3', paddingBottom: '5px', display: 'inline-block' }}>NHÀ TRAI</h4>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '15px', color: '#ad8685', lineHeight: '1.6' }}>
                Ông: Phạm Đức Cảnh<br/>
                Bà: Vũ Thị Thu Hường
              </p>
            </div>
          </div>
        </FadeInSection>

        {/* COUPLE PHOTOS AND NAMES */}
        <FadeInSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', width: '100%', padding: '0 5px', marginBottom: '50px', position: 'relative' }}>
            
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '4px', fontSize: '18px', color: '#d2a7a6' }}>&hearts;</div>

            {/* Bride Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '8/10', borderRadius: '100px 100px 10px 10px', boxShadow: '0 8px 20px rgba(180,130,130,0.15)', backgroundImage: 'url(/images/img_co_dau_1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 20%', marginBottom: '15px' }}></div>
              <h2 style={{ fontFamily: "'Momo Signature', cursive", fontSize: '24px', color: '#8c6261', margin: 0, whiteSpace: 'nowrap' }}>Trúc Quỳnh</h2>
            </div>

            {/* Groom Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '8/10', borderRadius: '100px 100px 10px 10px', boxShadow: '0 8px 20px rgba(180,130,130,0.15)', backgroundImage: 'url(/images/image_chu_re.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 20%', marginBottom: '15px' }}></div>
              <h2 style={{ fontFamily: "'Momo Signature', cursive", fontSize: '24px', color: '#8c6261', margin: 0, whiteSpace: 'nowrap' }}>Văn Phong</h2>
            </div>

          </div>
        </FadeInSection>

        {/* EVENT DETAILS */}
        <FadeInSection>
          <div style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '15px', padding: '30px 20px', boxShadow: '0 8px 25px rgba(180, 130, 130, 0.1)', marginBottom: '50px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#8a5d5c', marginBottom: '25px', fontStyle: 'italic' }}>Chương Trình Sự Kiện</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', color: '#9c7473', marginBottom: '5px' }}>CỖ CHÍNH</h4>
              <p style={{ color: '#ad8685', fontSize: '15px' }}>10:00 | Chủ Nhật, 26/04/2025</p>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ fontSize: '16px', color: '#9c7473', marginBottom: '5px' }}>LỄ VU QUY</h4>
              <p style={{ color: '#ad8685', fontSize: '15px' }}>14:00 | Chủ Nhật, 26/04/2025</p>
            </div>

            <div style={{ borderTop: '1px dashed #eac4c3', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '16px', color: '#9c7473', marginBottom: '5px' }}>ĐỊA ĐIỂM TỔ CHỨC</h4>
              <p style={{ color: '#ad8685', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
                Tại gia đình nhà gái:<br/>
                <b>Số 41, Tổ dân phố Trần Phú, Xã Cổ Lễ<br/>Tỉnh Ninh Bình</b>
              </p>

              <div style={{ width: '100%', height: '250px', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #faeaea', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }}>
                <iframe 
                  src="https://maps.google.com/maps?q=M%E1%BA%A7m+Non+Ban+Mai,+tt.+C%E1%BB%95+L%E1%BB%85,+C%E1%BB%95+L%E1%BB%85,+Ninh+B%C3%ACnh&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <a 
                href="https://www.google.com/maps?q=M%E1%BA%A7m+Non+Ban+Mai,+tt.+C%E1%BB%95+L%E1%BB%85,+C%E1%BB%95+L%E1%BB%85,+Ninh+B%C3%ACnh&ftid=0x3135e20899587d1b:0x5bd64740a770c476" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#9c7473',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  fontSize: '15px',
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(156, 116, 115, 0.3)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                  <path d="M12 21.5C12 21.5 20.5 15.6 20.5 9.5C20.5 4.80558 16.6944 1 12 1C7.30558 1 3.5 4.80558 3.5 9.5C3.5 15.6 12 21.5 12 21.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mở Bản Đồ
              </a>
            </div>
          </div>
        </FadeInSection>

        {/* GIFT BOX SECTION */}
        <FadeInSection>
          <div style={{ width: '100%', marginBottom: '50px', padding: '0 10px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#8a5d5c', marginBottom: '35px', fontStyle: 'italic' }}>Hộp Mừng Cưới</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Fake coins in background */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '10%', left: '15%', width: '30px', height: '30px', backgroundColor: '#ffd700', borderRadius: '50%', border: '4px solid #e5b800', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b38f00', fontWeight: 'bold', fontSize: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>💰</div>
                <div style={{ position: 'absolute', top: '5%', right: '20%', width: '40px', height: '40px', backgroundColor: '#ffd700', borderRadius: '50%', border: '4px solid #e5b800', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b38f00', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>💰</div>
                <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '35px', height: '35px', backgroundColor: '#ffd700', borderRadius: '50%', border: '4px solid #e5b800', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b38f00', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>💰</div>
                <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: '25px', height: '25px', backgroundColor: '#ffd700', borderRadius: '50%', border: '3px solid #e5b800', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b38f00', fontWeight: 'bold', fontSize: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>💰</div>
              </div>

              {/* Red Envelope Button */}
              <button 
                onClick={() => setIsGiftPopupOpen(true)}
                className="gift-box-shake"
                style={{ 
                  background: 'linear-gradient(135deg, #d32f2f, #b71c1c)', 
                  width: '180px', 
                  height: '240px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  position: 'relative', 
                  cursor: 'pointer', 
                  boxShadow: '0 10px 25px rgba(211, 47, 47, 0.4)',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  padding: 0
                }}
              >
                {/* Envelope details */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', width: '25px', height: '25px', borderTop: '3px solid #ffd54f', borderLeft: '3px solid #ffd54f' }}></div>
                <div style={{ position: 'absolute', top: '15px', right: '15px', width: '25px', height: '25px', borderTop: '3px solid #ffd54f', borderRight: '3px solid #ffd54f' }}></div>
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '25px', borderBottom: '3px solid #ffd54f', borderLeft: '3px solid #ffd54f' }}></div>
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '25px', height: '25px', borderBottom: '3px solid #ffd54f', borderRight: '3px solid #ffd54f' }}></div>
                
                <div style={{ 
                  width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#ffd54f', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', border: '4px solid #ffe082'
                }}>
                  <span style={{ color: '#d32f2f', fontSize: '30px', fontWeight: 'bold' }}>囍</span>
                </div>
              </button>
              
              <p style={{ marginTop: '20px', color: '#9c7473', fontSize: '14px', fontWeight: 500 }}>Nhấn để mở</p>
            </div>
          </div>
        </FadeInSection>

        {/* PHOTO GALLERY */}
        <div style={{ width: '100%', marginBottom: '50px', padding: '0 10px' }}>
          <FadeInSection>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#8a5d5c', textAlign: 'center', marginBottom: '25px', fontStyle: 'italic' }}>Ký Ức Tình Yêu</h3>
          </FadeInSection>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FadeInSection delay="0.1s">
              <img src="/images/img_4.jpg" alt="Memory 1" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>
            
            <FadeInSection delay="0.2s">
              <img src="/images/img_5.jpg" alt="Memory 2" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>

            <FadeInSection delay="0.1s">
              <img src="/images/img_6.jpg" alt="Memory 3" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>

            <FadeInSection delay="0.2s">
              <img src="/images/img_7.jpg" alt="Memory 4" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>

            <FadeInSection delay="0.1s">
              <img src="/images/img_8.jpg" alt="Memory 5" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>

            <FadeInSection delay="0.2s">
              <img src="/images/img_9.jpg" alt="Memory 6" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>

            <FadeInSection delay="0.1s">
              <img src="/images/img_10.jpg" alt="Memory 7" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', boxShadow: '0 4px 12px rgba(180,130,130,0.1)' }} />
            </FadeInSection>
          </div>
        </div>

        {/* POEM / QUOTE */}
        <FadeInSection delay="0.2s">
          <div style={{ textAlign: 'center', marginBottom: '60px', padding: '0 10px' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#9c7473', fontStyle: 'italic', lineHeight: '1.8', marginBottom: '20px' }}>
              "Nắng có nhẹ nhàng thì hoa mới nở,<br/>
              Tình có sâu đậm thì mới vương vấn một đời."<br/>
              Cảm ơn vì đã là mảnh ghép tuyệt vời<br/>trong thanh xuân của chúng mình.
            </p>
          </div>
        </FadeInSection>

      </div>

      {/* GIFT POPUP MODAL */}
      <div className={`modal-overlay ${isGiftPopupOpen ? 'open' : ''}`} onClick={() => setIsGiftPopupOpen(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Hộp Mừng Cưới</h3>
            <button className="close-btn" onClick={() => setIsGiftPopupOpen(false)}>&times;</button>
          </div>
          <div className="modal-body" style={{ backgroundColor: '#faebeb' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '25px 20px', boxShadow: '0 4px 15px rgba(180,130,130,0.1)' }}>
              <h4 style={{ color: '#8a5d5c', fontSize: '18px', marginBottom: '15px', fontWeight: 600 }}>Cô Dâu - Trúc Quỳnh</h4>
              <div style={{ width: '200px', height: '200px', margin: '0 auto 15px auto', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f0dcdc' }}>
                <img src="/images/qr_mung_cuoi.PNG" alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <p style={{ color: '#8a5d5c', fontWeight: 'bold', fontSize: '16px', margin: '0 0 5px 0' }}>DUONG TRUC QUYNH</p>
              <p style={{ color: '#ad8685', fontSize: '14px', margin: '0 0 20px 0' }}>Techcombank - 19036312246010</p>
              
              <a 
                href="/images/qr_mung_cuoi.PNG" 
                download="QR_DuongTrucQuynh_Techcombank.png"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#e6c8c8',
                  color: '#8a5d5c',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                  <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 17V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Lưu QR
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
