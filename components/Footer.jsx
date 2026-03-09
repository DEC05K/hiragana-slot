export default function Footer() {
  return (
    <footer className="footer-main" style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '14px',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>
      <a
        href="https://www.buymeacoffee.com/dec05k"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', lineHeight: 0, marginTop: '4px' }}
      >
        <img
          src="/yellow-button.png"
          alt="Buy me a coffee"
          style={{ height: '38px', width: 'auto', borderRadius: '6px' }}
        />
      </a>

      <div style={{
        fontSize: '9px',
        color: 'var(--text-muted)',
        letterSpacing: '0.16em',
        textAlign: 'center',
        lineHeight: 1.8,
        fontFamily: "'Noto Sans JP', sans-serif",
      }}>
        <div>
          Made by{' '}
          <a href="https://x.com/decosk3" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
            DEC05K
          </a>
        </div>
        <div>©︎ 2026 DEC05K</div>
      </div>
    </footer>
  )
}
