import { useEffect, useState } from 'react';
import { toRomaji } from '../data/romaji';
import { T } from '../utils/i18n';

export default function Result({ word, lang, visible }) {
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (visible && word) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setShowTransition(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setShowTransition(false);
  }, [visible, word]);

  if (!word) {
    return <div style={{ marginTop: '22px', minHeight: '56px' }} aria-hidden="true" />;
  }

  const romaji = toRomaji(word);
  const showRomaji = lang === 'en';
  const resultLabel = T[lang].result;

  return (
    <div style={{ marginTop: '22px', minHeight: '56px', textAlign: 'center' }}>
      {showRomaji && (
        <div
          className={`result-romaji ${showTransition ? 'visible' : ''}`}
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: '13px',
            fontWeight: 300,
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
          }}
        >
          {romaji}
        </div>
      )}

      <div
        className={`result-word ${showTransition ? 'visible' : ''}`}
        style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: '39px',
          fontWeight: 300,
          letterSpacing: '0.28em',
          color: 'var(--text-primary)',
        }}
      >
        {word}
      </div>

      {showTransition && (
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.24em',
          marginTop: '5px',
          textTransform: 'uppercase',
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>
          {resultLabel}
        </div>
      )}
    </div>
  );
}
