import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'

function MostSkipped({ entry, skipCount, avgSkipMs, totalPlays }) {
  const [image, setImage] = useState(null)

  const title = entry.master_metadata_track_name
  const artist = entry.master_metadata_album_artist_name
  const albumName = entry.master_metadata_album_album_name
  const avgSeconds = Math.round(avgSkipMs / 1000)
  const avgMinutes = Math.floor(avgSeconds / 60)
  const avgRemainder = avgSeconds % 60

  useEffect(() => {
    async function fetchArtwork() {
      try {
        const query = encodeURIComponent(`${artist} ${albumName}`)
        const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
        const data = await res.json()
        const img = data.data?.[0]?.cover_xl
        if (img) setImage(img)
      } catch (err) {
        console.error('Failed to fetch artwork:', err)
      }
    }
    fetchArtwork()
  }, [entry])

  return (
    <StatsCard>
      <p className="stats-card-label">
        YOUR MOST SKIPPED
      </p>
      {image && (
        <img src={image} alt={title}
          className="stats-card-image" />
      )}
      <h2 className="stats-card-title">{title}</h2>
      <p className="stats-card-subtitle">{artist}</p>
      <p className="stats-card-note">{albumName}</p>
<p className="stats-card-small">
  played {totalPlays} times · skipped {skipCount} times
</p>
<p className="stats-card-small">
you tend to skip at {avgMinutes}:{avgRemainder.toString().padStart(2, '0')}
</p>    </StatsCard>
  )
}

export default MostSkipped