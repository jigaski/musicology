import { useState, useEffect } from 'react'
import StatsCard from './StatsCard'

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
    <StatsCard>
      <p className="stats-card-label">
        YOUR FIRST SONG
      </p>
      {artwork && (
        <img 
          src={artwork} 
          alt={`${entry.master_metadata_track_name} artwork`} 
          className="stats-card-image"
        />
      )}
      <h2 className="stats-card-title">
        {entry.master_metadata_track_name}
      </h2>
      <p className="stats-card-subtitle">
        {entry.master_metadata_album_artist_name}
      </p>
      <p className="stats-card-note">
        {entry.master_metadata_album_album_name}
      </p>
      <p className="stats-card-meta">
        {formattedDate} at {formattedTime}
      </p>
      <p className="stats-card-small">
        Played for {secondsPlayed} seconds · {entry.skipped ? 'Skipped' : 'Completed'}
      </p>
    </StatsCard>
  )
}

export default FirstSong