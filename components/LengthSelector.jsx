import { T } from '../utils/i18n';

export default function LengthSelector({ reelCount, onChange, disabled, lang }) {
  const lengths = [2, 3, 4, 5, 6];
  const labels = T[lang].lenLabels;

  return (
    <div style={{ display: 'flex', gap: '5px', margin: '16px 0 20px' }}>
      {lengths.map((len, i) => (
        <button
          key={len}
          type="button"
          onClick={() => onChange(len)}
          disabled={disabled}
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: '12px',
            width: '34px',
            height: '34px',
            border: `1px solid ${reelCount === len ? 'var(--accent)' : 'var(--border)'}`,
            background: reelCount === len ? 'var(--accent)' : 'var(--surface)',
            color: reelCount === len ? '#fff' : 'var(--text-secondary)',
            borderRadius: '4px',
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.3 : 1,
            transition: 'all 0.15s',
          }}
          aria-pressed={reelCount === len}
          aria-label={`${labels[i]}文字`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
