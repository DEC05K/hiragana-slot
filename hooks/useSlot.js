import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { HIRAGANA, HIRAGANA_REV } from '../data/hiragana';

const CHAR_H_VAR = () => {
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue('--char-h').trim();
  return parseInt(val) || 32;
};

const SPEED_MAX  = 8.0;
const SPEED_MIN  = 0.3;
const ACCEL_TIME = 600;
const DECEL_TIME = 500;

function buildCharList() {
  let result = [];
  for (let i = 0; i < 8; i++) result = result.concat(HIRAGANA_REV);
  return result;
}

export function useSlot(reelCount) {
  const [reelStates, setReelStates]   = useState([]);
  const [isSpinning, setIsSpinning]   = useState(false);
  const [result, setResult]           = useState(null);
  const reelsRef     = useRef([]);
  const intervalRef  = useRef(null);
  const trackRefs    = useRef([]);

  const applyOffset = useCallback((idx) => {
    const r = reelsRef.current[idx];
    const charH = CHAR_H_VAR();
    if (r && trackRefs.current[idx]) {
      trackRefs.current[idx].style.transform = `translateY(${-r.offset + charH}px)`;
    }
  }, []);

  const initReels = useCallback((n) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const charH = CHAR_H_VAR();
    const newReels = Array.from({ length: n }, () => ({
      chars:       buildCharList(),
      offset:      Math.floor(Math.random() * HIRAGANA.length) * charH,
      speed:       0,
      stopped:     false,
      stopping:    false,
      stopStartTime: null,
      currentChar: '',
    }));
    reelsRef.current = newReels;
    setReelStates(newReels.map(r => ({ stopped: r.stopped, stopping: false, currentChar: r.currentChar })));
    setResult(null);
    setIsSpinning(false);
  }, []);

  useLayoutEffect(() => { initReels(reelCount); }, [reelCount, initReels]);

  const setTrackRef = useCallback((idx, el) => {
    trackRefs.current[idx] = el;
    if (el && reelsRef.current[idx]) {
      const r = reelsRef.current[idx];
      const charH = CHAR_H_VAR();
      el.style.transform = `translateY(${-r.offset + charH}px)`;
    }
  }, []);

  const startSpin = useCallback(() => {
    const startTime = Date.now();

    reelsRef.current.forEach((r) => {
      r.stopped       = false;
      r.speed         = 0;
      r.stopping      = false;
      r.stopStartTime = null;
    });

    if (intervalRef.current) clearInterval(intervalRef.current);
    setResult(null);
    setIsSpinning(true);
    setReelStates(reelsRef.current.map(r => ({ stopped: false, stopping: false, currentChar: '' })));

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const charH = CHAR_H_VAR();

      reelsRef.current.forEach((r, i) => {
        if (r.stopped) return;

        if (r.stopping) {
          const decelElapsed = Date.now() - r.stopStartTime;
          const progress = Math.min(decelElapsed / DECEL_TIME, 1);
          r.speed = SPEED_MAX * (1 - progress) * (1 - progress);

          if (r.speed < SPEED_MIN) {
            const snapped = Math.round(r.offset / charH) * charH;
            r.offset  = snapped;
            r.stopped = true;
            applyOffset(i);

            const charIdx = (snapped / charH) % r.chars.length;
            const safeIdx = ((Math.round(charIdx) % r.chars.length) + r.chars.length) % r.chars.length;
            r.currentChar = r.chars[safeIdx];

            setReelStates(prev =>
              prev.map((s, idx) => idx === i ? { stopped: true, stopping: false, currentChar: r.currentChar } : s)
            );

            if (reelsRef.current.every(rr => rr.stopped)) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setIsSpinning(false);
              const word = reelsRef.current.map(rr => rr.currentChar).join('');
              setResult(word);
            }
            return;
          }
        } else {
          const accelProgress = Math.min(elapsed / ACCEL_TIME, 1);
          r.speed = SPEED_MAX * accelProgress;
        }

        r.offset -= r.speed;
        if (r.offset < charH * 4) r.offset += (r.chars.length / 2) * charH;
        applyOffset(i);
      });
    }, 16);
  }, [applyOffset]);

  const stopReel = useCallback((idx) => {
    const r = reelsRef.current[idx];
    if (!r || r.stopped || r.stopping) return;

    r.stopping      = true;
    r.stopStartTime = Date.now();

    setReelStates(prev =>
      prev.map((s, i) => i === idx ? { ...s, stopping: true } : s)
    );
  }, []);

  const stopAll = useCallback(() => {
    reelsRef.current.forEach((_, i) => stopReel(i));
  }, [stopReel]);

  return {
    reelStates,
    isSpinning,
    result,
    startSpin,
    stopReel,
    stopAll,
    initReels,
    setTrackRef,
    reelsRef,
  };
}
