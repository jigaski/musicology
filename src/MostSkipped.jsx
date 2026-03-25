function MostSkipped({ track, skipCount, avgSkipMs, totalPlays }) {
  const [title, artist] = track.split(' - ')
  const avgSeconds = Math.round(avgSkipMs / 1000)
  const avgMinutes = Math.floor(avgSeconds / 60)
  const avgRemainder = avgSeconds % 60

  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      margin: '16px auto',
      textAlign: 'center'
    }}>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '16px' }}>
        YOUR MOST SKIPPED
      </p>
      <h2 style={{ margin: '0 0 4px' }}>{title}</h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>{artist}</p>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
        played {totalPlays} times · skipped {skipCount} of them
      </p>
      <p style={{ color: '#888', fontSize: '13px' }}>
        you tend quit around {avgMinutes}:{avgRemainder.toString().padStart(2, '0')}
      </p>
    </div>
  )
}

export default MostSkipped