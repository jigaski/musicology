function FirstSong({ entry }) {
  const date = new Date(entry.ts)
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const formattedTime = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  const secondsPlayed = Math.round(entry.ms_played / 1000)

  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      margin: '40px auto',
      textAlign: 'center'
    }}>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
        YOUR FIRST SONG
      </p>
      <h2 style={{ margin: '0 0 4px' }}>
        {entry.master_metadata_track_name}
      </h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>
        {entry.master_metadata_album_artist_name}
      </p>
      <p style={{ color: '#888', fontSize: '14px', margin: '0 0 16px' }}>
        {entry.master_metadata_album_album_name}
      </p>
      <p style={{ fontSize: '13px', color: '#666' }}>
        {formattedDate} at {formattedTime}
      </p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Played for {secondsPlayed} seconds · Skipped
      </p>
    </div>
  )
}

export default FirstSong