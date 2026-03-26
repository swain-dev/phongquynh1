'use client';

import { useState, useRef, useEffect } from 'react';
import './globals.css';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Sync state with actual audio DOM events so external play calls update the icon
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Attempt auto-play silently (may be blocked by browser)
    audio.volume = 0.5;
    audio.play().catch(() => setIsPlaying(false));

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <>
      <audio id="bg-music" ref={audioRef} src="/music/music_back.mp3" loop />
      
      <div className="audio-control-wrapper" onClick={toggleAudio}>
        <div className={`audio-toggle ${isPlaying ? 'mrotate' : ''}`}>
          <svg className="music-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="#FFF"/>
          </svg>
          {!isPlaying && (
            <div style={{position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', paddingTop: '15px'}}>
              <div style={{transform: 'rotate(45deg)', width: '100%', height: '1px', background: '#fff'}}></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
