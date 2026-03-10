import { ImageResponse } from '@vercel/og'
import { toRomaji } from '../../../data/romaji'

export const runtime = 'edge'

export async function GET(request) {
  try {
    const fontRes = await fetch(
      new URL('/fonts/NotoSerifJP-Light.ttf', request.url).toString()
    )
    const fontData = await fontRes.arrayBuffer()

    const { searchParams } = new URL(request.url)
    const raw  = searchParams.get('word') || 'ひらがな'
    const word = [...raw].slice(0, 10).join('')  // 最大10文字に制限
    const romaji = toRomaji(word, ' · ')

    const fontSize =
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
            }}
          >
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.38em',
              paddingLeft: '0.38em',
              color: '#a09d97',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              lineHeight: '1.4',
            }}>
              HIRAGANA SLOT
            </div>
            <div style={{
              fontSize: '20px',
              letterSpacing: '0.16em',
              paddingLeft: '0.16em',
              color: '#1a1917',
              fontFamily: 'NotoSerifJP',
              fontWeight: '300',
              lineHeight: '1.6',
            }}>
              ひらがなスロット
            </div>
            <div style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              paddingLeft: '0.12em',
              color: '#a09d97',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              lineHeight: '1.4',
            }}>
              文字を回して、ことばを生む。
            </div>
          </div>

          {/* ── 中央グループ（ローマ字＋ワード）── */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* ローマ字 */}
            <div style={{
              fontSize: '17px',
              letterSpacing: '0.32em',
              paddingLeft: '0.32em',
              color: '#a09d97',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              lineHeight: '1',
            }}>
              {romaji}
            </div>

            {/* ひらがなワード */}
            <div style={{
              fontSize: `${fontSize}px`,
              fontWeight: '300',
              color: '#1a1917',
              letterSpacing: '0.28em',
              paddingLeft: '0.28em',
              fontFamily: 'NotoSerifJP',
              lineHeight: '1',
              whiteSpace: 'nowrap',
            }}>
              {word}
            </div>
          </div>

          {/* ── 右下URL ── */}
          <div style={{
            position: 'absolute',
            bottom: '52px',
            right: '60px',
            fontSize: '11px',
            color: '#c8c5bc',
            letterSpacing: '0.12em',
            fontFamily: 'sans-serif',
          }}>
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
        fonts: [{
          name: 'NotoSerifJP',
          data: fontData,
          weight: 300,
          style: 'normal',
        }],
      }
    )
  } catch (e) {
    return new Response(`OGP generation failed: ${e.message}`, { status: 500 })
  }
}