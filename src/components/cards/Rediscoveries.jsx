import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'
import { useRandomCycle } from '../../utils/useRandomCycle'

function Rediscoveries({ rediscoveries }) {
  const { current, visible, next } = useRandomCycle(rediscoveries)
  const [artwork, setArtwork] = useState(null)

  const entry = current?.entry

useEffect(() => {
  if (!entry) return

  setArtwork(null)

  async function fetchArtwork() {
    try {
      const query = encodeURIComponent(
        `${entry.master_metadata_album_artist_name} ${entry.master_metadata_album_album_name}`,
      )
      const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
      const data = await res.json()
      let image = data.data?.[0]?.cover_xl

      if (!image) {
        const trackQuery = encodeURIComponent(
          `${entry.master_metadata_album_artist_name} ${entry.master_metadata_track_name}`
        )
        const fallback = await fetch(`/deezer/search?q=${trackQuery}&limit=1`)
        const fallbackData = await fallback.json()
        image = fallbackData.data?.[0]?.album?.cover_xl
      }

      if (image) setArtwork(image)
    } catch (err) {
      console.error('Failed to fetch artwork:', err)
    }
  }

  fetchArtwork()
}, [entry])

  return (
    <StatsCard className="stats-card-rediscovery" onClick={next}>
      <div className={`rediscovery-content ${visible ? 'visible' : 'hidden'}`}>
        <p className="stats-card-label">A REDISCOVERY</p>
        {artwork && (
          <img
            src={artwork}
            alt={`${entry.master_metadata_track_name} artwork`}
            className="stats-card-image"
          />
        )}
        <h2 className="stats-card-title">{entry.master_metadata_track_name}</h2>
        <p className="stats-card-subtitle">{entry.master_metadata_album_artist_name}</p>
        <p className="stats-card-note">{entry.master_metadata_album_album_name}</p>
        <p className="stats-card-meta">
          you came back after {current.gapDays} days
        </p>
      </div>
    </StatsCard>
  )
}

export default Rediscoveries
