import SlotApp from '../components/App'

export async function generateMetadata({ searchParams }) {
  const word = (await searchParams)?.word || 'ひらがな'
  const siteUrl = 'https://hiragana-slot.vercel.app'
  const ogUrl = `${siteUrl}/api/og?word=${encodeURIComponent(word)}`

  return {
    openGraph: {
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    },
  }
}

export default function Page() {
  return <SlotApp />
}
