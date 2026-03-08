import { T } from '../utils/i18n';

export default function Header({ lang, onLangToggle, title, tagline }) {
  const langLabel = T[lang].langSwitch;

  return (
    <header style={{ width: '100%', padding: '28px 0 12px', textAlign: 'center', position: 'relative' }}>
      <button
        type="button"
        onClick={onLangToggle}
        style={{
          position: 'absolute',
          top: '28px',
          right: '0',
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          padding: '4px 8px',
          cursor: 'pointer',
        }}
        aria-label={lang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
      >
        {langLabel}
      </button>

      <p style={{
        fontFamily: "'Noto Serif JP', serif",
        fontSize: '9px',
        fontWeight: 300,
        letterSpacing: '0.38em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: '6px',
      }}>
        Hiragana Slot
      </p>

      <h1 style={{
        fontFamily: "'Noto Serif JP', serif",
        fontSize: '22px',
        fontWeight: 300,
        letterSpacing: '0.16em',
        color: 'var(--text-primary)',
        lineHeight: 1.3,
      }}>
        {title}
      </h1>

      <p style={{
        marginTop: '5px',
        fontSize: '10px',
        color: 'var(--text-muted)',
        letterSpacing: '0.12em',
        fontFamily: "'Noto Sans JP', sans-serif",
      }}>
        {tagline}
      </p>
    </header>
  );
}
