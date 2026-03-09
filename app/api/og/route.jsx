import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

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
  try {
    const { searchParams } = new URL(request.url)
    const word = searchParams.get('word') || 'ひらがな'
    const romaji = toRomaji(word)

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
          {/* 左上ロゴ */}
          <div style={{
            position: 'absolute',
            top: '52px',
            left: '60px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#a09d97', fontFamily: 'sans-serif' }}>
              HIRAGANA SLOT
            </div>
            <div style={{ fontSize: '20px', letterSpacing: '0.16em', color: '#1a1917', fontFamily: 'serif', marginTop: '4px' }}>
              ひらがなスロット
            </div>
            <div style={{ fontSize: '12px', letterSpacing: '0.12em', color: '#a09d97', fontFamily: 'sans-serif', marginTop: '2px' }}>
              文字を回して、ことばを生む。
            </div>
          </div>

          {/* ローマ字 */}
          <div style={{
            fontSize: '18px',
            letterSpacing: '0.28em',
            color: '#a09d97',
            fontFamily: 'sans-serif',
            marginBottom: '16px',
          }}>
            {romaji}
          </div>

          {/* ひらがなワード */}
          <div style={{
            fontSize: `${fontSize}px`,
            fontWeight: '300',
            color: '#1a1917',
            letterSpacing: '0.28em',
            fontFamily: 'serif',
            lineHeight: '1',
          }}>
            {word}
          </div>

          {/* 右下URL */}
          <div style={{
            position: 'absolute',
            bottom: '52px',
            right: '60px',
            fontSize: '11px',
            color: '#c8c5bc',
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
      { width: 1200, height: 630 }
    )
  } catch (e) {
    return new Response(`OGP generation failed: ${e.message}`, { status: 500 })
  }
}