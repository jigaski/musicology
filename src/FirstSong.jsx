import { useState, useEffect } from 'react'

function FirstSong({ entry }) {
  const [artwork, setArtwork] = useState(null)

  useEffect(() => {
    async function fetchArtwork() {
      try {
        const query = encodeURIComponent(
          `${entry.master_metadata_album_artist_name} ${entry.master_metadata_track_name}`
        )
        const res = await fetch(
          `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`
        )
        const data = await res.json()
        console.log('firstSong track:', entry.master_metadata_track_name)

        if (data.results.length > 0) {
          // Replace 100x100 with 600x600 for higher-res
          setArtwork(data.results[0].artworkUrl100.replace('100x100', '600x600'))
        }
      } catch (err) {
        console.error('Failed to fetch artwork', err)
      }
    }
    fetchArtwork()
  }, [entry])

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
      textAlign: 'center',
      background: '#0b0a12',        // dark card background
      color: '#fff',
      boxShadow: '0 0 28px rgba(245,200,66,0.1)'
    }}>
      {artwork && (
        <img 
          src={artwork} 
          alt={`${entry.master_metadata_track_name} artwork`} 
          style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }}
        />
      )}
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
        Played for {secondsPlayed} seconds · {entry.skipped ? 'Skipped' : 'Completed'}
      </p>
    </div>
  )
}

export default FirstSong