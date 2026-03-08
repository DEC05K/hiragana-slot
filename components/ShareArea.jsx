'use client'

import { useState } from 'react'

const SITE_URL = 'https://hiragana-slot.vercel.app'

export default function ShareArea({ word, lang, visible }) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!visible || !word) return <div style={{ minHeight: '40px' }} />

  const ogImageUrl = `${SITE_URL}/api/og?word=${encodeURIComponent(word)}`
  const shareUrl = `${SITE_URL}/?word=${encodeURIComponent(word)}`
  const tweetText = lang === 'en'
    ? `"${word}" — from Hiragana Slot ✨ #hiraganaslot\n${shareUrl}`
    : `「${word}」\nひらがなスロットで出た言葉 #ひらがなスロット\n${shareUrl}`

  const handleShareClick = () => setShowModal(true)

  const handleTweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      '_blank'
    )
    setShowModal(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(word).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <>
      {/* ── ボタンエリア ── */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Xシェアボタン */}
        <button onClick={handleShareClick} style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.06em',
          padding: '9px 18px',
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'all 0.15s',
        }}>
          <svg width="11" height="11" viewBox="0 0 1200 1227" fill="currentColor">
            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
          </svg>
          {lang === 'en' ? 'Share' : 'シェア'}
        </button>

        {/* コピーボタン */}
        <button onClick={handleCopy} style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.06em',
          padding: '9px 18px',
          background: 'transparent',
          color: copied ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: copied ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'all 0.15s',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          {copied
            ? (lang === 'en' ? 'Copied!' : 'コピー済')
            : (lang === 'en' ? 'Copy' : 'コピー')
          }
        </button>
      </div>

      {/* ── OGP確認モーダル ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              borderRadius: '8px',
              padding: '20px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            {/* OGP画像プレビュー */}
            <div style={{
              width: '100%',
              aspectRatio: '1200/630',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              marginBottom: '16px',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ogImageUrl}
                alt="シェア画像"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* 説明テキスト */}
            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: '16px',
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>
              {lang === 'en'
                ? 'This image will appear when shared on X'
                : 'Xでシェアするとこの画像が表示されます'}
            </p>

            {/* ボタン */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {/* キャンセル */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  padding: '9px 20px',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {lang === 'en' ? 'Cancel' : 'キャンセル'}
              </button>

              {/* Xで投稿 */}
              <button
                onClick={handleTweet}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  padding: '9px 20px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: '1px solid transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 1200 1227" fill="currentColor">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
                </svg>
                {lang === 'en' ? 'Post on X' : 'Xに投稿'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
