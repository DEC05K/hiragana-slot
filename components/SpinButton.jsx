import { T } from '../utils/i18n';

export default function SpinButton({ isSpinning, onSpin, onStopAll, lang }) {
  const spinLabel = T[lang].spin;
  const spinSubLabel = T[lang].spinSub;
  const stopAllLabel = T[lang].stopAll;
  const stopSubLabel = T[lang].stopSub;

  return (
    <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'center', width: '100%' }}>
      <button
        type="button"
        className={`btn-spin ${isSpinning ? 'is-spinning' : ''}`}
        onClick={isSpinning ? onStopAll : onSpin}
        aria-label={isSpinning ? stopAllLabel : spinLabel}
      >
        <span className="btn-label">{isSpinning ? stopAllLabel : spinLabel}</span>
        <span className="btn-sub">{isSpinning ? stopSubLabel : spinSubLabel}</span>
      </button>
    </div>
  );
}
