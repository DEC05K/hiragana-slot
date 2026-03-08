import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

// ヘボン式ローマ字変換テーブル
const ROMAJI_MAP = {
  'あ':'a',  'い':'i',  'う':'u',  'え':'e',  'お':'o',
  'か':'ka', 'き':'ki', 'く':'ku', 'け':'ke', 'こ':'ko',
  'さ':'sa', 'し':'shi','す':'su', 'せ':'se', 'そ':'so',
  'た':'ta', 'ち':'chi','つ':'tsu','て':'te', 'と':'to',
  'な':'na', 'に':'ni', 'ぬ':'nu', 'ね':'ne', 'の':'no',
  'は':'ha', 'ひ':'hi', 'ふ':'fu', 'へ':'he', 'ほ':'ho',
  'ま':'ma', 'み':'mi', 'む':'mu', 'め':'me', 'も':'mo',
  'や':'ya', 'ゆ':'yu', 'よ':'yo',
  'ら':'ra', 'り':'ri', 'る':'ru', 'れ':'re', 'ろ':'ro',
  'わ':'wa', 'を':'wo', 'ん':'n',
  'が':'ga', 'ぎ':'gi', 'ぐ':'gu', 'げ':'ge', 'ご':'go',
  'ざ':'za', 'じ':'ji', 'ず':'zu', 'ぜ':'ze', 'ぞ':'zo',
  'だ':'da', 'ぢ':'di', 'づ':'du', 'で':'de', 'ど':'do',
  'ば':'ba', 'び':'bi', 'ぶ':'bu', 'べ':'be', 'ぼ':'bo',
  'ぱ':'pa', 'ぴ':'pi', 'ぷ':'pu', 'ぺ':'pe', 'ぽ':'po',
}

function toRomaji(word) {
  return word.split('').map(c => ROMAJI_MAP[c] || c).join(' · ')
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get('word') || 'ひらがな'
  const romaji = toRomaji(word)

  // Noto Serif JP を Google Fonts API から取得
  const fontUrl =
    'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300&display=swap&subset=japanese'

  let fontData = null
  try {
    const cssRes = await fetch(fontUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    const css = await cssRes.text()

    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/)
    if (match) {
      const fontRes = await fetch(match[1])
      fontData = await fontRes.arrayBuffer()
    }
  } catch (e) {
    console.error('Font fetch failed:', e)
  }

  const wordFontSize =
    word.length <= 2 ? 200 :
    word.length <= 3 ? 170 :
    word.length <= 4 ? 140 :
    word.length <= 5 ? 112 : 90

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#f5f4f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* ── 左上ロゴブロック ── */}
        <div
          style={{
            position: 'absolute',
            top: '52px',
            left: '60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.38em',
              color: '#a09d97',
              textTransform: 'uppercase',
              fontFamily: fontData ? 'NotoSerifJP' : 'serif',
              fontWeight: '300',
              lineHeight: '1.4',
            }}
          >
            HIRAGANA SLOT
          </div>
          <div
            style={{
              fontSize: '20px',
              letterSpacing: '0.16em',
              color: '#1a1917',
              fontFamily: fontData ? 'NotoSerifJP' : 'serif',
              fontWeight: '300',
              lineHeight: '1.6',
            }}
          >
            ひらがなスロット
          </div>
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: '#a09d97',
              fontFamily: fontData ? 'NotoSerifJP' : 'serif',
              fontWeight: '300',
              lineHeight: '1.4',
            }}
          >
            文字を回して、ことばを生む。
          </div>
        </div>

        {/* ── 中央：ローマ字 ── */}
        <div
          style={{
            fontSize: '18px',
            letterSpacing: '0.28em',
            color: '#a09d97',
            fontFamily: 'serif',
            fontWeight: '300',
            marginBottom: '16px',
            textTransform: 'lowercase',
          }}
        >
          {romaji}
        </div>

        {/* ── 中央：ひらがなワード ── */}
        <div
          style={{
            fontSize: `${wordFontSize}px`,
            fontWeight: '300',
            color: '#1a1917',
            letterSpacing: '0.28em',
            lineHeight: '1',
            textAlign: 'center',
            fontFamily: fontData ? 'NotoSerifJP' : 'serif',
          }}
        >
          {word}
        </div>

        {/* ── 右下URL ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '60px',
            fontSize: '11px',
            color: '#c8c5bc',
            letterSpacing: '0.12em',
            fontFamily: 'serif',
          }}
        >
          hiragana-slot.vercel.app
        </div>

        {/* ボーダー */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: '#d8d5cc' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: '#d8d5cc' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '1px', background: '#d8d5cc' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '1px', background: '#d8d5cc' }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? {
            fonts: [
              {
                name: 'NotoSerifJP',
                data: fontData,
                weight: 300,
                style: 'normal',
              },
            ],
          }
        : {}),
    }
  )
}
