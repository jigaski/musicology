import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'

function MoodShift({ morningEvening, className = '' }) {
  const [morningImage, setMorningImage] = useState(null)
  const [eveningImage, setEveningImage] = useState(null)

  const morningTrack = morningEvening?.morning?.entry
  const eveningTrack = morningEvening?.evening?.entry

  useEffect(() => {
    if (!morningTrack || !eveningTrack) return

    async function fetchArtwork(artist, albumName, setImage) {
      try {
        const query = encodeURIComponent(`${artist} ${albumName}`)
        const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
        const data = await res.json()
        const image = data.data?.[0]?.cover_xl
        if (image) setImage(image)
      } catch (err) {
        console.error('Failed to fetch artwork:', err)
      }
    }

    fetchArtwork(
      morningTrack.master_metadata_album_artist_name,
      morningTrack.master_metadata_album_album_name,
      setMorningImage,
    )

    fetchArtwork(
      eveningTrack.master_metadata_album_artist_name,
      eveningTrack.master_metadata_album_album_name,
      setEveningImage,
    )
  }, [morningTrack, eveningTrack])

  if (!morningTrack || !eveningTrack) return null

  return (
    <StatsCard className={className}>
      <p className="stats-card-label">mood shift</p>

      <div className="most-played-inner">
        <section className="most-played-panel">
          <p className="most-played-panel-label">morning</p>
          {morningImage && (
            <img
              src={morningImage}
              alt={morningTrack.master_metadata_track_name}
              className="stats-card-image most-played-image"
            />
          )}
          <h2 className="stats-card-title">{morningTrack.master_metadata_track_name}</h2>
          <p className="stats-card-subtitle">{morningTrack.master_metadata_album_artist_name}</p>
          <p className="stats-card-note">{morningTrack.master_metadata_album_album_name}</p>
          <p className="stats-card-note">{morningEvening.morning.count} plays</p>
        </section>

        <section className="most-played-panel">
          <p className="most-played-panel-label">evening</p>
          {eveningImage && (
            <img
              src={eveningImage}
              alt={eveningTrack.master_metadata_track_name}
              className="stats-card-image most-played-image"
            />
          )}
          <h2 className="stats-card-title">{eveningTrack.master_metadata_track_name}</h2>
          <p className="stats-card-subtitle">{eveningTrack.master_metadata_album_artist_name}</p>
          <p className="stats-card-note">{eveningTrack.master_metadata_album_album_name}</p>
          <p className="stats-card-note">{morningEvening.evening.count} plays</p>
        </section>
      </div>
    </StatsCard>
  )
}

export default MoodShift
