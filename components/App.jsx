'use client';

import { useState, useEffect } from 'react';
import { T } from '../utils/i18n';
import { useSlot } from '../hooks/useSlot';
import Header from './Header';
import LengthSelector from './LengthSelector';
import SpeedSlider from './SpeedSlider';
import ReelsWrapper from './ReelsWrapper';
import SpinButton from './SpinButton';
import Result from './Result';
import ShareArea from './ShareArea';
import Footer from './Footer';

export default function App() {
  const [lang, setLang] = useState('ja');
  const [reelCount, setReelCount] = useState(3);
  const [speed, setSpeed] = useState(5);
  const [isPC, setIsPC] = useState(false);
  const [mounted, setMounted] = useState(false);

  const slot = useSlot(reelCount, speed);

  const handleLangToggle = () => {
    setLang((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  const handleReelCountChange = (n) => {
    setReelCount(n);
  };

  useEffect(() => {
    setMounted(true);
    setIsPC(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let prevWidth = window.innerWidth;
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        if (currentWidth === prevWidth) return;
        prevWidth = currentWidth;
        setIsPC(currentWidth >= 768);
        if (!slot.isSpinning) {
          slot.initReels(reelCount);
        }
      }, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [mounted, reelCount, slot.isSpinning]);

  const resultVisible = !!slot.result;

  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        minHeight: '100svh',
        backgroundColor: 'var(--bg)',
        fontFamily: "'Noto Sans JP', sans-serif",
        color: 'var(--text-primary)',
        padding: '0 16px 0',
      }}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '40px',
        }}
      >
        <Header
          lang={lang}
          onLangToggle={handleLangToggle}
          title={T[lang].title}
          tagline={T[lang].tagline}
        />
        <LengthSelector
          reelCount={reelCount}
          onChange={handleReelCountChange}
          disabled={slot.isSpinning}
          lang={lang}
        />
        <SpeedSlider
          value={speed}
          onChange={setSpeed}
          lang={lang}
        />
        {!mounted ? (
          <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true" />
        ) : (
          <>
            <ReelsWrapper
              reelCount={reelCount}
              reelStates={slot.reelStates}
              reelsRef={slot.reelsRef}
              setTrackRef={slot.setTrackRef}
              stopReel={slot.stopReel}
              isSpinning={slot.isSpinning}
              lang={lang}
              isPC={isPC}
            />
            <SpinButton
              isSpinning={slot.isSpinning}
              onSpin={slot.startSpin}
              onStopAll={slot.stopAll}
              lang={lang}
            />
            <Result
              word={slot.result}
              lang={lang}
              visible={resultVisible}
            />
            <ShareArea
              word={slot.result}
              lang={lang}
              visible={resultVisible}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
