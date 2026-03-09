import './globals.css'

export const metadata = {
  title: 'ひらがなスロット / Hiragana Slot',
  description: 'Spin hiragana characters and discover random Japanese words. A minimalist slot machine for language lovers.',
  metadataBase: new URL('https://hiragana-slot.vercel.app'),
  openGraph: {
    title: 'ひらがなスロット / Hiragana Slot',
    description: 'Spin hiragana characters and discover random Japanese words.',
    url: 'https://hiragana-slot.vercel.app',
    // imagesは削除（page.jsxのgenerateMetadataで動的に生成する）
  },
  twitter: {
    card: 'summary_large_image',
    site: '@decosk3',
    title: 'ひらがなスロット / Hiragana Slot',
    description: 'Spin hiragana characters and discover random Japanese words.',
    // imagesは削除（page.jsxのgenerateMetadataで動的に生成する）
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400&family=Noto+Sans+JP:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#f5f4f0" />
      </head>
      <body>{children}</body>
    </html>
  )
}
