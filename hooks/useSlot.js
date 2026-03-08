'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { HIRAGANA } from '../data/hiragana'

// ── 定数 ──
const SPEED_MAX  = 9.0   // 最高速度 px/frame
const ACCEL_MS   = 500   // 加速にかかるms
const DECEL_MS   = 480   // 減速にかかるms

const CHAR_H_VAR = () => {
  if (typeof window === 'undefined') return 32
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--char-h')
  ) || 32
}

// 1リールのcharリストを生成（逆順 × 8周）
function buildCharList() {
  const rev = [...HIRAGANA].reverse()
  let out = []
  for (let i = 0; i < 8; i++) out = out.concat(rev)
  return out
}

export function useSlot(reelCount) {
  // ── React state（UIの更新のみ） ──
  const [reelStates, setReelStates] = useState([])   // [{stopped, currentChar}]
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult]         = useState(null)

  // ── Ref（アニメーションループで使う値はすべてここ） ──
  const reelsRef    = useRef([])   // リールの物理状態
  const trackRefs   = useRef([])   // DOM refs
  const intervalRef = useRef(null)
  const spinStartRef= useRef(0)    // スピン開始時刻

  // ── trackRefの登録（Reel.jsxから呼ばれる） ──
  const setTrackRef = useCallback((idx, el) => {
    trackRefs.current[idx] = el
  }, [])

  // ── offsetをDOMに反映 ──
  const applyOffset = useCallback((idx) => {
    const el = trackRefs.current[idx]
    if (!el) return
    const charH = CHAR_H_VAR()
    el.style.transform = `translateY(${-reelsRef.current[idx].offset + charH}px)`
  }, [])

  // ── リール初期化 ──
  const initReels = useCallback((n) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    const charH = CHAR_H_VAR()
    reelsRef.current = Array.from({ length: n }, () => ({
      chars:        buildCharList(),
      offset:       Math.floor(Math.random() * HIRAGANA.length) * charH,
      speed:        0,
      stopped:      false,
      stopping:     false,  // 減速中フラグ
      decelStart:   null,   // 減速開始時刻
      currentChar:  '',
    }))
    setReelStates(Array.from({ length: n }, () => ({ stopped: false, currentChar: '' })))
    setResult(null)
    setIsSpinning(false)
  }, [])

  useEffect(() => {
    initReels(reelCount)
  }, [reelCount, initReels])

  // ── スピン開始 ──
  const startSpin = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    setResult(null)
    setIsSpinning(true)
    spinStartRef.current = Date.now()

    // 全リールをリセット
    reelsRef.current.forEach((r) => {
      r.stopped    = false
      r.stopping   = false
      r.decelStart = null
      r.speed      = 0
    })
    setReelStates(prev => prev.map(() => ({ stopped: false, currentChar: '' })))

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - spinStartRef.current
      const charH   = CHAR_H_VAR()
      let allStopped = true

      reelsRef.current.forEach((r, i) => {
        if (r.stopped) return
        allStopped = false

        if (r.stopping) {
          // ── 減速フェーズ ──
          const decelElapsed = Date.now() - r.decelStart
          const t = Math.min(decelElapsed / DECEL_MS, 1)
          // easeOut cubic: 最初は速く、最後はゆっくり
          r.speed = SPEED_MAX * (1 - t) * (1 - t) * (1 - t)

          if (r.speed < 0.4) {
            // スナップして完全停止
            const snapped = Math.round(r.offset / charH) * charH
            r.offset      = snapped
            r.stopped     = true
            r.speed       = 0
            applyOffset(i)

            // 停止文字の特定
            const raw    = (snapped / charH) % r.chars.length
            const safeIdx= ((Math.round(raw) % r.chars.length) + r.chars.length) % r.chars.length
            r.currentChar = r.chars[safeIdx]

            // stateを更新（このリールだけ）
            setReelStates(prev =>
              prev.map((s, idx) =>
                idx === i ? { stopped: true, currentChar: r.currentChar } : s
              )
            )
            return
          }
        } else {
          // ── 加速フェーズ ──
          const t = Math.min(elapsed / ACCEL_MS, 1)
          r.speed = SPEED_MAX * t
        }

        // offsetを進める
        r.offset -= r.speed
        // ループ（十分な余裕をもって折り返す）
        if (r.offset < charH * 4) {
          r.offset += (r.chars.length / 2) * charH
        }
        applyOffset(i)
      })

      // 全リール停止チェック
      if (allStopped && reelsRef.current.length > 0 && reelsRef.current.every(r => r.stopped)) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsSpinning(false)
        const word = reelsRef.current.map(r => r.currentChar).join('')
        setResult(word)
      }
    }, 16)
  }, [applyOffset])

  // ── 1リール停止（減速開始） ──
  const stopReel = useCallback((idx) => {
    const r = reelsRef.current[idx]
    if (!r || r.stopped || r.stopping) return

    r.stopping   = true
    r.decelStart = Date.now()
    // UIのボタン状態だけ先に更新（止めるボタンをグレーアウト）
    setReelStates(prev =>
      prev.map((s, i) => i === idx ? { ...s, stopping: true } : s)
    )
  }, [])

  // ── 全リール停止 ──
  const stopAll = useCallback(() => {
    reelsRef.current.forEach((_, i) => stopReel(i))
  }, [stopReel])

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
  }
}
