import SlotApp from '../components/App'

// 動的OGPメタタグを生成
export async function generateMetadata({ searchParams }) {
  const word = searchParams?.word || 'ひらがな'
  const siteUrl = 'https://hiragana-slot.vercel.app' // 実際のURLに変更

  return {
    openGraph: {
      images: [{
        url: `${siteUrl}/api/og?word=${encodeURIComponent(word)}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${siteUrl}/api/og?word=${encodeURIComponent(word)}`],
    },
  }
}

export default function Page() {
  return <SlotApp />
}
