function MostPlayed({ mostPlays, mostMinutes }) {
  const hoursListened = Math.round(mostMinutes[1] / 1000 / 60 / 60)
  const [minutesTitle, minutesArtist] = mostMinutes[0].split(' - ')
  const [playsTitle, playsArtist] = mostPlays[0].split(' - ')

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
        YOUR MOST PLAYED
      </p>

      <p style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>MOST PLAYS</p>
      <h2 style={{ margin: '0 0 4px' }}>{playsTitle}</h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>{playsArtist}</p>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
        played {mostPlays[1]} times
      </p>

      <p style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>MOST TIME</p>
      <h2 style={{ margin: '0 0 4px' }}>{minutesTitle}</h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>{minutesArtist}</p>
      <p style={{ color: '#888', fontSize: '13px' }}>
        {hoursListened} hours of listening
      </p>
    </div>
  )
}

export default MostPlayed