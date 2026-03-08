import { useRef } from 'react';

const BADGE = ['①', '②', '③', '④', '⑤', '⑥'];

export default function Reel({ chars, trackRef, stopped, stopping, onStop, disabled, index, lang }) {
  const windowRef = useRef(null);

  const stopLabel = lang === 'ja' ? '止める' : 'Stop';
  const badge = BADGE[index] ?? '';

  return (
    <div className="reel-col">
      <div className="reel-badge">{badge}</div>

      <div ref={windowRef} className={`reel-window ${disabled ? 'spinning' : ''}`}>
        <div className="reel-center-line" aria-hidden="true" />
        <div ref={trackRef} className="reel-track">
          {chars?.map((ch, i) => (
            <div key={i} className="reel-char">{ch}</div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`stop-btn ${stopped ? 'stopped' : ''} ${stopping ? 'stopping' : ''}`}
        onClick={() => onStop()}
        disabled={!disabled || stopped || stopping}
        aria-label={stopped || stopping ? '' : stopLabel}
      >
        {stopped ? '✓' : stopLabel}
      </button>
    </div>
  );
}
