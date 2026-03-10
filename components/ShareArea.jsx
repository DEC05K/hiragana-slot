'use client'
import { useState, useEffect } from 'react'

export default function ShareArea({ word, lang, visible }) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [siteUrl, setSiteUrl]     = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // クライアントサイドでのみURLを取得
  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  // showModal が true の間だけ Esc キーを監視する
  useEffect(() => {
    if (!showModal) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowModal(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showModal])

  if (!visible || !word) return <div style={{ minHeight: '40px' }} />

  const ogImageUrl = siteUrl
    ? `${siteUrl}/api/og?word=${encodeURIComponent(word)}`
    : null

  const shareUrl = siteUrl
    ? `${siteUrl}/?word=${encodeURIComponent(word)}`
    : ''

  const tweetText = lang === 'en'
    ? `"${word}" — from Hiragana Slot ✨ #hiraganaslot\n${shareUrl}`
    : `「${word}」\nひらがなスロットで出たあなたの言葉🎰 #hiraganaslot\n${shareUrl}`

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

  const handleDownload = async () => {
    if (!ogImageUrl) return
    setDownloading(true)
    try {
      const res = await fetch(ogImageUrl)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `hiragana-slot-${word}.png`
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      console.error('Download failed:', e)
    } finally {
      setDownloading(false)
    }
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
        <button onClick={() => {
          setImageLoaded(false)
          setShowModal(true)
        }} style={{
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
              background: '#f5f4f0',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* 読み込み中プレースホルダー */}
              {!imageLoaded && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#f5f4f0',
                  zIndex: 1,
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '5px',
                  }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#a09d97',
                          animation: `ogp-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    color: '#a09d97',
                    letterSpacing: '0.2em',
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}>
                    {lang === 'en' ? 'generating...' : '生成中...'}
                  </div>
                </div>
              )}

              {/* OGP画像本体 */}
              {ogImageUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                  src={ogImageUrl}
                  alt="OGP preview"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                </>
              )}
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

              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  padding: '9px 20px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  cursor: downloading ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: downloading ? 0.5 : 1,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloading
                  ? (lang === 'en' ? 'Saving...' : '保存中...')
                  : (lang === 'en' ? 'Save Image' : '画像を保存')
                }
              </button>

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
