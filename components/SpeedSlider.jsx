'use client'
import { useEffect, useRef } from 'react'
import { T } from '../utils/i18n'

export default function SpeedSlider({ value, onChange, lang, disabled }) {
  const sliderRef = useRef(null)

  // スライダーの塗りをリアルタイム更新
  const updateFill = (val) => {
    const slider = sliderRef.current
    if (!slider) return
    const min = parseFloat(slider.min)
    const max = parseFloat(slider.max)
    const pct = (val - min) / (max - min) * 100
    slider.style.background =
      `linear-gradient(to right, #1a1917 ${pct}%, #d8d5cc ${pct}%)`
  }

  useEffect(() => {
    updateFill(value)
  }, [value])

  const handleChange = (e) => {
    const val = parseFloat(e.target.value)
    updateFill(val)
    onChange(val)
  }

  const slowLabel = T[lang]?.speedSlow ?? (lang === 'en' ? 'slow' : '遅')
  const fastLabel = T[lang]?.speedFast ?? (lang === 'en' ? 'fast' : '速')

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '0 0 20px',
      width: '100%',
      maxWidth: '240px',
    }}>
      {/* 遅ラベル */}
      <span style={{
        fontFamily: "'Noto Serif JP', serif",
        fontSize: '11px',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        minWidth: '24px',
      }}>
        {slowLabel}
      </span>

      {/* スライダー */}
      <input
        ref={sliderRef}
        type="range"
        className="speed-slider-thumb"
        min={1}
        max={10}
        step={0.1}
        value={value}
        onChange={handleChange}
        disabled={false}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          WebkitAppearance: 'none',
          appearance: 'none',
          height: '1px',
          outline: 'none',
          cursor: 'pointer',
          borderRadius: '1px',
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      />

      {/* 速ラベル */}
      <span style={{
        fontFamily: "'Noto Serif JP', serif",
        fontSize: '11px',
        letterSpacing: '0.14em',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        minWidth: '24px',
        textAlign: 'right',
      }}>
        {fastLabel}
      </span>
    </div>
  )
}
